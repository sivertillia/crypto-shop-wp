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
echo '<h1>Hello, World!</h1>';
echo '<script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>';
echo '<script src="https://cdn.ethers.io/lib/ethers-5.2.umd.min.js" type="application/javascript"></script>';
echo '<script src="https://cdnjs.cloudflare.com/ajax/libs/web3/1.7.4-rc.0/web3.min.js" type="application/javascript"></script>';
echo '<script type="text/javascript" src="https://unpkg.com/qr-code-styling@1.6.0-rc.1/lib/qr-code-styling.js"></script>';
echo '<button id="connect_metamask">Connect MetaMask</button>';
echo '<button id="pay">Pay</button>';
echo '<button id="balance">Balance </button>';
echo '<div id="canvas" style="text-align: center"></div>';
echo '<script src="main.js" type="application/javascript"></script>';
