<?php
/**
 * Plugin Name:       Crypto Payments Plugin
 * Plugin URI:        http://localhost:80
 * Description:       A Wordpress plugin for WooCommerce
 * Author:            Team Beta
 * Version:           0.0.1
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
if (!in_array('woocommerce/woocommerce.php', apply_filters('active_plugins', get_option('active_plugins')))) {
    return;
}

add_filter('woocommerce_payment_gateways', 'wc_crypto_payments_add_to_gateways');
function wc_crypto_payments_add_to_gateways($gateways)
{
    $gateways[] = 'WC_Gateway_CryptoPayments';
    return $gateways;
}

/**
 * CPG Payments Gateway
 *
 * Provides an CPG Payments Gateway; mainly for testing purposes.
 * We load it later to ensure WC is loaded first since we're extending it.
 *
 * @class          WC_Gateway_CryptoPayments
 * @extends        WC_Payment_Gateway
 * @version        0.0.1
 * @package        WooCommerce/Classes/Payment
 * @author         Team Beta
 */
add_action( 'plugins_loaded', 'wc_crypto_payments_gateway_init' );
function wc_crypto_payments_gateway_init()
{
    class WC_Gateway_CryptoPayments extends WC_Payment_Gateway
    {
        const GATEWAY_NAME = 'crypto_gateway';
        public function __construct()
        {
            $this->id = self::GATEWAY_NAME;
            $this->icon = '';
            $this->has_fields = true;
            $this->method_title = 'Crypto Gateway';
            $this -> method_desciption = 'Description of Crypto Payment gateway';

            $this->supports = array(
                'products'
            );

            $this->init_form_fields();
        }

        public function init_form_fields()
        {
            $this->form_fields = array(
                'enabled' => array(
                    'title'       => 'Enable/Disable',
                    'label'       => 'Enable Crypto Gateway',
                    'type'        => 'checkbox',
                    'description' => '',
                    'default'     => 'no'
                ),
                'title' => array(
                    'title'       => 'Title',
                    'type'        => 'text',
                    'description' => 'This controls the title which the user sees during checkout.',
                    'default'     => 'Credit Card',
                    'desc_tip'    => true,
                ),
                'description' => array(
                    'title'       => 'Description',
                    'type'        => 'textarea',
                    'description' => 'This controls the description which the user sees during checkout.',
                    'default'     => 'Pay with your credit card via our super-cool payment gateway.',
                ),
                'testmode' => array(
                    'title'       => 'Test mode',
                    'label'       => 'Enable Test Mode',
                    'type'        => 'checkbox',
                    'description' => 'Place the payment gateway in test mode using test API keys.',
                    'default'     => 'yes',
                    'desc_tip'    => true,
                ),
                'test_publishable_key' => array(
                    'title'       => 'Test Publishable Key',
                    'type'        => 'text'
                ),
                'test_private_key' => array(
                    'title'       => 'Test Private Key',
                    'type'        => 'password',
                ),
                'publishable_key' => array(
                    'title'       => 'Live Publishable Key',
                    'type'        => 'text'
                ),
                'private_key' => array(
                    'title'       => 'Live Private Key',
                    'type'        => 'password'
                )
            );
        }

        public function process_payment($order_id)
        {
            global $wp;
            $checkout = WC()->checkout();
            $order = wc_get_order($order_id);
            $order_amount = $order->get_total();

            if (is_null($order)) {
                $error_message = 'Order not found';
                error_log($error_message);
                throw new Exception(__($error_message, 'wc-gateway-cpg-payments'));
            }
            $api_url = 'http://localhost:8000';

            $request = wp_remote_post("{$api_url}/api/init", array(
                'method' => 'POST',
                'timeout' => 180,
                'data_format' => 'body',
                'headers' => array(
                    'Content-Type' => 'application/json',
                ),
                'body' => json_encode([
                    'amount' => (float)$order_amount,
                    'order_id' => $order_id,
                ]),
            ));

            $response_body = $request['body'];
            $response_body_json = json_decode($response_body, TRUE);

            if ($response_body_json['payment_id']) {
//                WC()->cart->empty_cart();
                $redirect_path = plugin_dir_url(__FILE__) . 'pay.php' . "?address={$response_body_json['address']}" . "&payment_id={$response_body_json['payment_id']}" . "&amount={$response_body_json['amount']}" . '&redirect_url=' . urlencode($this->get_return_url($order));
                return array(
                    'result' => 'success',
                    'redirect' => $redirect_path,
                );

            }
            throw new Exception(__('Error', 'wc-gateway-cpg-payments'));
        }
    }
}
?>