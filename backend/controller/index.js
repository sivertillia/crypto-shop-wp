const Dai = require('../contracts/Dai.json')

module.exports.getContract = (req, res) => {
  res.json(Dai)
}