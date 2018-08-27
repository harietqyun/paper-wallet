var ecc = require('eosjs-ecc');

exports.generateWallet = function(seed, symbol) {
  var wif = ecc.seedPrivate(seed.toString());

  return {
    publicAddress: ecc.privateToPublic(wif),
    privateKey: wif
  };
};