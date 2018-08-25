#!/usr/bin/env node

var path = require('path');
var fs = require('fs');
var qrText = require('text-qrcode');
var qrImg = require('qr-image');
var temp = require('temp');
var CoinKey = require('coinkey');
var HDKey = require('hdkey');
var CoinInfo = require('coininfo');
var crypto = require('crypto');
var PDFDocument = require('pdfkit');

var supportedCoins = ['btc', 'btg', 'dash', 'doge', 'ltc', 'zec'];

async function main() {
  var symbol = process.argv[2];
  if (symbol)
    symbol = symbol.toLowerCase();

  if (!symbol || supportedCoins.indexOf(symbol) < 0) {
    console.log('Usage: paper-wallet [btc|btg|dash|doge|ltc|zec]');
    return;
  }

  var seed = crypto.randomBytes(32);
  
  var info = CoinInfo(symbol);

  var root = HDKey.fromMasterSeed(seed, info.versions.bip32.version);
  var key = root.derive(`m/44'/${info.versions.bip44}'/0'/0/0`);
  var ck = new CoinKey(key.privateKey, info.versions);
  
  var publicAddress = ck.publicAddress;
  var privateKey = ck.privateWif;

  var publicAddressQR = qrImg.imageSync(publicAddress, {
    size: 8,
    margin: 0
  });

  var privateKeyQR = qrImg.imageSync(privateKey, {
    size: 8,
    margin: 0
  });

  temp.track();

  var publicAddressQRFile = temp.path();
  fs.writeFileSync(publicAddressQRFile, publicAddressQR);
  var privateKeyQRFile = temp.path();
  fs.writeFileSync(privateKeyQRFile, privateKeyQR);

  var doc = new PDFDocument({
    size: 'A4'
  });

  doc.pipe(fs.createWriteStream('paper-wallet.pdf'));

  doc.fontSize(30)

  doc.text(
    `${symbol.toUpperCase()} Paper Wallet`, 
    0, 50,
    {align: 'center'})
  
  doc.fontSize(20)
  
  doc.text('Public Receiving Address', 100, 110);
  doc.fontSize(13)
  doc.text(publicAddress, 100, 135);
  doc.image(publicAddressQRFile, 100, 160);
  
  doc.fontSize(20)
  doc.text('Private Spending Key', 100, 420);
  doc.fontSize(13)
  doc.text(privateKey, 100, 445);
  doc.image(privateKeyQRFile, 100, 470);
  
  doc.end();

  var addressQRText = qrText.generate(publicAddress);
  var privateKeyQRText = qrText.generate(privateKey);

  console.log(`${symbol.toUpperCase()} Paper Wallet`);
  console.log();
  
  console.log('Public Receiving Address');
  console.log(publicAddress);
  console.log(addressQRText);
  console.log();

  console.log('Private Spending Key');
  console.log(privateKey);
  console.log(privateKeyQRText);
  console.log();
  
  console.log(`Paper wallet file created: ${path.join(__dirname, 'paper-wallet.pdf')}`);
}

main();