const Dai = artifacts.require('Dai.sol')
const PaymentProcessor = artifacts.require('PaymentProcessor.sol')

module.exports = async (deployer, network, addresses) => {
  const [admin, payer, _] = addresses

  console.log(network)

  if (network === 'test') {
    await deployer.deploy(Dai)
    const dai = await Dai.deployed();
    await dai.faucet(payer, web3.utils.toWei('100000'))
    // 1 DAI token = 1 * 10 * 18 'dai wei'
    // 1 Ether token = 1 * 10 * 18 'Ether wei'

    await deployer.deploy(PaymentProcessor, admin, dai.address)
  }

  else if (network === 'develop') {
    await deployer.deploy(Dai)
    const dai = await Dai.deployed();
    await dai.faucet(payer, web3.utils.toWei('100000'))
    // 1 DAI token = 1 * 10 * 18 'dai wei'
    // 1 Ether token = 1 * 10 * 18 'Ether wei'

    await deployer.deploy(PaymentProcessor, admin, dai.address)
  } else {
    const ADMIN_ADDRESS = '0xe833c4107048bcc92c797595bbed3ecb36e2e227'
    const DAI_ADDRESS = ''
    await deployer.deploy(PaymentProcessor, ADMIN_ADDRESS, DAI_ADDRESS)
  }
}