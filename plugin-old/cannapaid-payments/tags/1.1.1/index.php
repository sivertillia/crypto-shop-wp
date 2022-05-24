<?php
/**
 * Plugin Name:       CannaPaid Payments Plugin
 * Plugin URI:        https://www.cannapaid.com
 * Description:       A Wordpress plugin for WooCommerce which implements credit & debit card payments via CannaPaid
 * Author:            Team Alpha
 * Version:           1.1.1
 * Requires at least: 5.2
 * Requires PHP:      5.6
 * License:           GPLv2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 *
 * This plugin is released under the GPLv2 License
 * (Please see the file "LICENSE" included with this plugin)
 *
 */
defined('ABSPATH') or exit;


// Make sure WooCommerce is active
if (!in_array('woocommerce/woocommerce.php', apply_filters('active_plugins', get_option('active_plugins')))) {
    return;
}

/**
 * Add the gateway to WC Available Gateways
 *
 * @param array $gateways all available WC gateways
 * @return array $gateways all WC gateways + Cannapaid gateway
 * @since 1.1.1
 */
function wc_cannapaid_add_to_gateways($gateways)
{
    $gateways[] = 'WC_Gateway_CannaPaid';
    return $gateways;
}

add_filter('woocommerce_payment_gateways', 'wc_cannapaid_add_to_gateways');


/**
 * Adds plugin page links
 *
 * @param array $links all plugin links
 * @return array $links all plugin links + our custom links (i.e., "Settings")
 * @since 1.1.1
 */
function wc_cannapaid_gateway_plugin_links($links)
{

    $plugin_links = array(
        '<a href="' . admin_url('admin.php?page=wc-settings&tab=checkout&section=cannapaid_gateway') . '">' . __('Configure', 'wc-gateway-cannapaid') . '</a>'
    );

    return array_merge($plugin_links, $links);
}

add_filter('plugin_action_links_' . plugin_basename(__FILE__), 'wc_cannapaid_gateway_plugin_links');


/**
 * Cannapaid Payment Gateway
 *
 * Provides an CannaPaid Payment Gateway; mainly for testing purposes.
 * We load it later to ensure WC is loaded first since we're extending it.
 *
 * @class        WC_Gateway_CannaPaid
 * @extends        WC_Payment_Gateway
 * @version        1.1.1
 * @package        WooCommerce/Classes/Payment
 * @author        SkyVerge
 */
function wc_cannapaid_gateway_init()
{
    class WC_Gateway_CannaPaid extends WC_Payment_Gateway
    {
        const GATEWAY_NAME = 'cannapaid_gateway';

        const ENV_LIVE = 'production';
        const ENV_TEST = 'development';

        const AUTH_TOKEN_LIVE = 'T9XU1cpC5hgls953qOLbUVmnT92S1Ml7';
        const AUTH_TOKEN_TEST = 'TSB4QkWfUO2jcIvnrVC4NCptNDJxojaf';

        /**
         * Constructor for the gateway.
         */
        public function __construct()
        {

            $this->id = self::GATEWAY_NAME;
            $this->icon = apply_filters('woocommerce_cannapaid_icon', '');
            $this->has_fields = false;
            $this->method_title = __('CannaPaid', 'wc-gateway-cannapaid');
            $this->method_description = __('Allows CannaPaid payments.', 'wc-gateway-cannapaid');

            // Load the settings.
            $this->init_form_fields();
            $this->init_settings();

            // Define user set variables
            $this->title = $this->get_option('title');
            $this->description = $this->get_option('description');
            $this->instructions = $this->get_option('instructions', $this->description);

            // Filter options
            add_filter('woocommerce_settings_api_sanitized_fields_' . $this->id, array($this, 'validate_form_options'));

            // Actions
            add_action('woocommerce_update_options_payment_gateways_' . $this->id, array($this, 'process_admin_options'));

            // Customer Emails
            add_action('woocommerce_email_before_order_table', array($this, 'email_instructions'), 10, 3);
        }

        public function validate_form_options($settings)
        {

            $token = $settings['payment_token'];
            if (!$token) return $settings;

            $decode_token = json_decode(base64_decode(str_replace('_', '/', str_replace('-', '+', explode('.', $token)[1]))));
            $api_url = $decode_token->api_url;

            $body = array(
                'token' => $token,
                'domain' => get_site_url(),
            );

            $request = wp_remote_post("{$api_url}/api/form-token/verify", array(
                'method' => 'POST',
                'data_format' => 'body',
                'headers' => array(
                    'Content-Type' => 'application/json',
                ),
                'body' => json_encode($body),
            ));

            $response = json_decode($request['body']);
            $success = $response->success;
            $errorMessage = $response->errorMessage;

            if (!$success) {
                echo '<div id="message" class="notice notice-error is-dismissible"><p>' . $errorMessage . '</p></div>';
                $settings['payment_token'] = '';
            }

            return $settings;
        }

        /**
         * Initialize Gateway Settings Form Fields
         */
        public function init_form_fields()
        {
            $fields = $this->get_fields();
            $this->form_fields = apply_filters('wc_cannapaid_form_fields', $fields);
        }

        public function get_fields()
        {
            return array(
                'enabled' => array(
                    'title' => __('Enable/Disable', 'wc-gateway-cannapaid'),
                    'type' => 'checkbox',
                    'label' => __('Enable Cannapaid Payment', 'wc-gateway-cannapaid'),
                    'default' => 'yes'
                ),

                'title' => array(
                    'title' => __('Title', 'wc-gateway-cannapaid'),
                    'type' => 'text',
                    'description' => __('This controls the title for the payment method the customer sees during checkout.', 'wc-gateway-cannapaid'),
                    'default' => __('Cannapaid Payment', 'wc-gateway-cannapaid'),
                    'desc_tip' => true,
                ),

                'description' => array(
                    'title' => __('Description', 'wc-gateway-cannapaid'),
                    'type' => 'textarea',
                    'description' => __('Use your Visa, Mastercard or Discover cards to pay for your order (AMEX not currently supported!)', 'wc-gateway-cannapaid'),
                    'default' => __('', 'wc-gateway-cannapaid'),
                    'desc_tip' => true,
                ),

                'instructions' => array(
                    'title' => __('Instructions', 'wc-gateway-cannapaid'),
                    'type' => 'textarea',
                    'description' => __('Use your Visa, Mastercard or Discover cards to pay for your order (AMEX not currently supported!)'),
                    'default' => '',
                    'desc_tip' => true,
                ),

                'mode' => array(
                    'title' => __('Mode', 'wc-gateway-cannapaid'),
                    'type' => 'select',
                    'label' => __('Payment mode', 'wc-gateway-cannapaid'),
                    'options' => array(
                        'T' => __('Test'),
                        'P' => __('Production'),
                    ),
                    'default' => 'T'
                ),

                'payment_token' => array(
                    'title' => __('Form token', 'wc-gateway-cannapaid'),
                    'type' => 'textarea',
                    'description' => __('Token for generate Cannapaid Payment form.', 'wc-gateway-cannapaid'),
                    'default' => '',
                    'desc_tip' => true,
                ),
            );
        }

        /**
         * Output for the order received page.
         */
        public function thankyou_page()
        {
            if ($this->instructions) {
                echo wpautop(wptexturize($this->instructions));
            }
        }


        /**
         * Add content to the WC emails.
         *
         * @access public
         * @param WC_Order $order
         * @param bool $sent_to_admin
         * @param bool $plain_text
         */
        public function email_instructions($order, $sent_to_admin, $plain_text = false)
        {

            if ($this->instructions && !$sent_to_admin && $this->id === $order->payment_method && $order->has_status('on-hold')) {
                echo wpautop(wptexturize($this->instructions)) . PHP_EOL;
            }
        }


        /**
         * Process the payment and return the result
         *
         * @param int $order_id
         * @return array
         */
        public function process_payment($order_id)
        {
            $checkout = WC()->checkout();
            $order = wc_get_order($order_id);
            if (is_null($order)) {
                $error_message = 'Order not found';
                error_log($error_message);
                return array('result' => 'failure', 'messages' => $error_message);
            }

            $payment_methods = WC()->payment_gateways->payment_gateways();
            $cannapaid_gateway = $payment_methods[self::GATEWAY_NAME];

            if (is_null($cannapaid_gateway)) {
                $error_message = 'Payment method not found';
                error_log($error_message);
                return array('result' => 'failure', 'messages' => $error_message);
            }

            $order_amount = $order->calculate_totals();
            $redirect = $cannapaid_gateway->get_return_url();

            $settings = $cannapaid_gateway->settings;
            $payment_token = $settings['payment_token'];
            $mode = $settings['mode'];

            $decode_token = json_decode(base64_decode(str_replace('_', '/', str_replace('-', '+', explode('.', $payment_token)[1]))));
            $api_url = $decode_token->api_url;

            $checkout_data = json_encode(array(
                'firstName' => $checkout->get_value('billing_first_name'),
                'lastName' => $checkout->get_value('billing_last_name'),
                'address' => $checkout->get_value('billing_address_1'),
                'city' => $checkout->get_value('billing_city'),
                'postCode' => $checkout->get_value('billing_postcode'),
                'country' => $checkout->get_value('billing_country'),
                'state' => $checkout->get_value('billing_state'),
                'email' => $checkout->get_value('billing_email'),
                'phone' => $checkout->get_value('billing_phone'),
            ));

            $transaction_mode = self::ENV_TEST;
            $auth_token = self::AUTH_TOKEN_TEST;
            if ($mode === 'P') {
                $transaction_mode = self::ENV_LIVE;
                $auth_token = self::AUTH_TOKEN_LIVE;
            }

            $body = array(
                'token' => $payment_token,
                'order_id' => $order_id,
                'amount' => $order_amount,
                'transaction_mode' => $transaction_mode,
                'redirect_url' => $redirect,
                'device_type' => 'web',
                'customer_data' => $checkout_data
            );


            $request = wp_remote_post("{$api_url}/api/order/session/init", array(
                'method' => 'POST',
                'data_format' => 'body',
                'headers' => array(
                    'authorization' => $auth_token,
                    'Content-Type' => 'application/json',
                ),
                'body' => json_encode($body),
            ));

            $form_url = json_decode($request['body'])->form_url;

            if (is_null($form_url)) {
                $error_message = 'Payment form url not found';
                error_log($error_message);
                return array('result' => 'failure', 'messages' => $error_message);
            }

            return array('result' => 'success', 'redirect' => $form_url);
        }


    } // end \WC_Gateway_CannaPaid class
}

add_action('plugins_loaded', 'wc_cannapaid_gateway_init', 11);