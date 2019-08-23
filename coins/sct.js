var CoinKey = require('coinkey');
var HDKey = require('hdkey');
var CoinInfo = require('coininfo');

exports.generateWallet = function(seed, symbol) {
  var info = CoinInfo(symbol);

  var root = HDKey.fromMasterSeed(seed);
  var key = root.derive(`m/44'/${info.versions.bip44}'/0'/0/0`);
  var ck = new CoinKey(key.privateKey, info.versions);
  
  return {
    publicAddress: ck.publicAddress,
    privateKey: ck.privateWif
  };
};
