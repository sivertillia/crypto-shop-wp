const PaymentProcessor = artifacts.require('PaymentProcessor.sol')
const Dai = artifacts.require('Dai.sol')

module.exports = async (deployer, network, addresses) => {
  if (network === 'develop') {
    await deployer.deploy(Dai)
    await deployer.deploy(PaymentProcessor)
  }
}