var CoinKey = require('coinkey');
var HDKey = require('hdkey');
var bchaddr = require('bchaddrjs');

exports.generateWallet = function(seed, symbol) {
  var info = {
    versions: {
      bip32: {
        private: 0x0488ade4,
        public: 0x0488b21e
      },
      bip44: 145,
      private: 0x80,
      public: 0x00,
      scripthash: 0x05
    }
  };

  var root = HDKey.fromMasterSeed(seed);
  var key = root.derive(`m/44'/${info.versions.bip44}'/0'/0/0`);
  var ck = new CoinKey(key.privateKey, info.versions);
  
  return {
    publicAddress: bchaddr.toBitpayAddress(ck.publicAddress),
    privateKey: ck.privateWif
  };
};