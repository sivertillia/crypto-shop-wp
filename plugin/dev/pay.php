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
echo '<script src="https://cdn.ethers.io/lib/ethers-5.2.umd.min.js" type="application/javascript"></script>';
echo '<script src="./main.js" type="application/javascript"></script>';
