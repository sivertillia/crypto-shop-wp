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
echo '<button id="connect_metamask">Connect MetaMask</button>';
echo '<button id="pay">Pay</button>';
echo '<button id="balance">Balance </button>';
echo '<script src="./main.js" type="application/javascript"></script>';
