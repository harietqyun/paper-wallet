#!/usr/bin/env node

var path = require('path');
var fs = require('fs');
var qrText = require('text-qrcode');
var qrImg = require('qr-image');
var temp = require('temp');
var crypto = require('crypto');
var PDFDocument = require('pdfkit');
var btc = require('./coins/btc.js');
var bch = require('./coins/bch.js');
var eth = require('./coins/eth.js');
var eos = require('./coins/eos.js');

async function main() {
  var symbol = process.argv[2];
  if (symbol)
    symbol = symbol.toLowerCase();

  var seed = crypto.randomBytes(32);
  
  var wallet;
  if (['btc','btg','dash','doge','ltc','zec'].indexOf(symbol) >= 0) {
    wallet = btc.generateWallet(seed, symbol);
  } else if (['bch'].indexOf(symbol) >= 0) {
    wallet = bch.generateWallet(seed, symbol);
  } else if (['eth'].indexOf(symbol) >= 0) {
    wallet = eth.generateWallet(seed, symbol);
  } else if (['eos'].indexOf(symbol) >= 0) {
    wallet = eos.generateWallet(seed, symbol);
  } else {
    console.log('Usage: paper-wallet [btc|bch|btg|dash|doge|eos|eth|ltc|zec]');
    return;
  }

  var publicAddressQR = qrImg.imageSync(wallet.publicAddress, {
    size: 8,
    margin: 0
  });

  var privateKeyQR = qrImg.imageSync(wallet.privateKey, {
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

  var pdfFile = path.join(__dirname, `paper-wallet-${symbol}-${Date.now()}.pdf`);

  doc.pipe(fs.createWriteStream(pdfFile));

  doc.fontSize(30);

  doc.text(
    `${symbol.toUpperCase()} Paper Wallet`, 
    0, 50,
    {align: 'center'});
  
  doc.fontSize(20);
  
  doc.text('Public Receiving Address', 100, 110);
  doc.fontSize(12);
  doc.text(wallet.publicAddress, 100, 135);
  doc.image(publicAddressQRFile, 100, 160);
  
  doc.fontSize(20);
  doc.text('Private Spending Key', 100, 440);
  doc.fontSize(12);
  doc.text(wallet.privateKey, 100, 465);
  doc.image(privateKeyQRFile, 100, 490);
  
  doc.end();

  var addressQRText = qrText.generate(wallet.publicAddress);
  var privateKeyQRText = qrText.generate(wallet.privateKey);

  console.log(`${symbol.toUpperCase()} Paper Wallet`);
  console.log();
  
  console.log('Public Receiving Address');
  console.log(wallet.publicAddress);
  console.log(addressQRText);
  console.log();

  console.log('Private Spending Key');
  console.log(wallet.privateKey);
  console.log(privateKeyQRText);
  console.log();
  
  console.log(`Paper wallet file created: ${pdfFile}`);
}

main();