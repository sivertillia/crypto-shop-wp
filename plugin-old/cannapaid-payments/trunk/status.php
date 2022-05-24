<?php
$root = dirname(dirname(dirname(dirname(__FILE__))));
if (file_exists($root.'/wp-load.php')) {
    require_once($root.'/wp-load.php');
} else {
    require_once($root.'/wp-config.php');
}
get_header();
?>

<?php
$root = dirname(dirname(dirname(dirname(__FILE__))));
if (file_exists($root.'/wp-load.php')) {
    require_once($root.'/wp-load.php');
} else {
    require_once($root.'/wp-config.php');
}
if (!isset($_SESSION)) {
    session_start();
}
class Site
{
    public function __construct()
    {

        $this->transaction_id = $_GET['transaction_id'];
        $this->order_id = $_GET['order_id'];
        $this->redirect_url = $_SESSION['redirect_url'];
        $this->init_view();
        $this->track_transaction($this->transaction_id, $this->order_id);
    }

    public function init_view()
    {
        $size_carousel = 50;
        $size_carousel_margin = $size_carousel / 2;
        echo '<style>';
        echo 'h3.text_loading {margin-bottom: 20px; color: black;}';
        echo '.my_block::before {width: 100%; height: 100%; font-size: 100%; line-height: 100%;}';
        echo '.block_carousel {position: relative; margin: 0 auto; width: ' . $size_carousel . 'px; height: ' . $size_carousel . 'px; font-size: ' . $size_carousel . 'px; margin-bottom: ' . $size_carousel_margin . 'px;}';
        echo 'li {list-style: none;}';
        echo '#my_content {width: 50%; margin-top: 50px; font-size: 16px;}';
        echo '.my_content {margin: 0 auto; text-align: center; font-size: 16px!important;}';
        echo '.storefront-breadcrumb {display: none!important;}';
        echo '</style>';
        echo '<div id="my_content" class="my_content">';
        echo '<h3 class="text_loading">Please wait, we are checking status of your transaction…</h3>';
        echo '<div class="block_carousel"><div class="blockUI my_block"></div></div>';
        echo '</div>';
    }

    public function track_transaction($transaction_id, $order_id)
    {
        $TRANSACTION_COMPLETE = 'COMPLETE';
        $TRANSACTION_CREATED = 'CREATED';
        $TRANSACTION_FAILED = 'FAILED';
        $TRANSACTION_ABANDONED = 'ABANDONED';
        $TRANSACTION_REFUNDED= 'REFUNDED';
        $TRANSACTION_PROCESSING= 'PROCESSING';
        $TRANSACTION_CHARGEBACK= 'CHARGEBACK';
        $TRANSACTION_CUSTOMER_VALIDATION= 'CUSTOMER_VALIDATION';

        $get_site = get_site_url();

        echo '<script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>';
        echo "
        <script>
            const div_content = document.getElementById('my_content')
            async function getPost() {
                let reason_text = 'Error transaction'
                try {
                    const formData = {
                        transaction_id: '$transaction_id',
                        order_id: '$order_id',
                    }
                    const complete_array = ['$TRANSACTION_COMPLETE']
                    const processing_array = ['$TRANSACTION_CREATED', '$TRANSACTION_PROCESSING', '$TRANSACTION_CUSTOMER_VALIDATION']
                    const failed_array = ['$TRANSACTION_ABANDONED', '$TRANSACTION_FAILED', '$TRANSACTION_REFUNDED', '$TRANSACTION_CHARGEBACK'] 
                    jQuery.ajax({
                        type: 'POST',
                        url: 'track_transaction.php',
                        dataType: 'json',
                        data: formData,
                        success: function (obj) {
                            const obj_json = JSON.parse(obj)
                            console.log('obj:', obj_json)
                            if (complete_array.includes(obj_json['status'])) {
                                clearInterval(timerId)
                                window.location.href = '$this->redirect_url'                             
                            } else if (processing_array.includes(obj_json['status'])) {
                              console.log('Processing')  
                            } else if (failed_array.includes(obj_json['status'])) {
                                clearInterval(timerId)
                                if (obj_json['fail_reason']) reason_text = obj_json['fail_reason']
                                div_content.classList.remove('my_content')
                                div_content.innerHTML = '<h1 style=\'font-weight: 400;\'>Order has not been received</h1>'
                                div_content.innerHTML += '<div class=\'woocommerce-NoticeGroup woocommerce-NoticeGroup-checkout\'><ul class=\'woocommerce-error\' role=\'alert\'><li>' + reason_text + '</li></ul></div>'
                                div_content.innerHTML += '<p style=\'color: black;\'>We are unable to process your order at this time.</p>'
                                div_content.innerHTML += '<a class=\'error-btn button\' href=\'$get_site\'>Return To Homepage</a>'                              
                            }
                        }
                    });
                } catch (e) {
                    clearInterval(timerId)
                    console.log(e)
                    reason_text = e.name
                    div_content.innerHTML = '<div class=\'woocommerce-NoticeGroup woocommerce-NoticeGroup-checkout\'><ul class=\'woocommerce-error\' role=\'alert\'><li>' + reason_text + '</li></ul></div>'
                    div_content.innerHTML += '<a class=\'error-btn button\' href=\'$get_site\'>Return To Homepage</a>'                 
                }
            }
            let timerId = setInterval(getPost, 5000)
        </script>";
    }
}

new Site;