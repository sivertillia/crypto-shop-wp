<?php
$root = dirname(dirname(dirname(dirname(__FILE__))));
if (file_exists($root . '/wp-load.php')) {
    require_once($root . '/wp-load.php');
} else {
    require_once($root . '/wp-config.php');
}
get_header();
?>

<?php
$root = dirname(dirname(dirname(dirname(__FILE__))));
if (file_exists($root . '/wp-load.php')) {
    require_once($root . '/wp-load.php');
} else {
    require_once($root . '/wp-config.php');
} ?>

<?php
$order_id = urldecode($_GET['order_id']);
?>
<div>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
    <script src="https://cdn.ethers.io/lib/ethers-5.2.umd.min.js" type="application/javascript"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/web3/1.7.4-rc.0/web3.min.js" type="application/javascript"></script>
    <script type="text/javascript" src="https://unpkg.com/qr-code-styling@1.6.0-rc.1/lib/qr-code-styling.js"></script>
    <script type="text/javascript" src="https://unpkg.com/axios@0.27.2/dist/axios.min.js"></script>
    <link href="style.css" rel="stylesheet">
    <button id="balance">Balance </button>
    <div id="time" style="text-align: center; font-size: 48px; color: #F6851B;"></div>
    <div id="amount" style="text-align: center; font-size: 38px; color: #F6851B;"></div>
    <input id="account" class="account" disabled>
    <div id="canvas" style="text-align: center"></div>
    <div class="box_btn">
        <button id="connect_metamask" class="btn metamask">Ethereum Connect</button>
        <button id="pay_metamask" class="btn metamask">Send Eth</button>
    </div>
    <script src="main.js" type="application/javascript"></script>
    <div class='hidden'
         data-order_id='<?= $order_id ?>'
    ></div>
</div>
