const PaymentProcessor = artifacts.require('PaymentProcessor.sol')

module.exports = async (deployer, network, addresses) => {
  if (network === 'develop') {
    await deployer.deploy(PaymentProcessor)
  }
}