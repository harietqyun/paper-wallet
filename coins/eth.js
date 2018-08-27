var coinethjs = require('coinethjs');

exports.generateWallet = function(seed, symbol) {
  var ethjs = coinethjs.fromSeedBuffer(seed);
  var key = ethjs.derivePath(`m/44'/60'/0'/0/0`);
  
  return {
    publicAddress: key.getAddress(),
    privateKey: key.getPrivateKey()
  };
};