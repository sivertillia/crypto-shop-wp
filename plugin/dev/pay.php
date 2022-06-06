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
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.14.7/dist/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>

<div class="pageWrapper">
    <div id="amount" style="text-align: center; font-size: 38px; color: #F6851B;"></div>
    <input id="account" class="account" hidden>
    <div id="canvas" style="text-align: center"></div>
<div class="formWrapper">
         <div class="fromBalance">
             <input id="amount_input" type="text" disabled />
         </div>
         <div class="fromBalance">
             <input id="converted_amount" type="text" placeholder="0.0" disabled />
                 <image id="currencyImage" src="" />
                 <button id="selectCoinButton" type="button" data-toggle="modal" data-target="#selectCurrencyModal">
                     NULL
                 </button>
         </div>
          <button class="btn btn-primary" id="connect_metamask">
          Connect Wallet
          </button>
          <button id="pay_metamask" class="btn btn-primary">Pay</button>
          <div>
            <!-- Modal -->
          <div class="modal fade" id="selectCurrencyModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content" style="border-radius: 15px;">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel">Select a token</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                   <div>
                    <input type="text" id="searchToken" class="searchField" placeholder="Search name"/>
                   </div>
                   <div style="margin-top: 10px">
                    Token name
                   </div>
                   <div id="tokensList">

                   </div>
                </div>
              </div>
            </div>
          </div>
          </div>
 </div>
 </div>
    <script src="main.js" type="application/javascript"></script>
    <div class='hidden'
         data-order_id='<?= $order_id ?>'
    ></div>
</div>
