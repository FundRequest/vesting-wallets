require('dotenv').config();
const fs = require('fs');
const sign = require('ethjs-signer').sign;
const SolidityFunction = require('web3/lib/web3/function');
const _ = require('lodash');
const Web3 = require('web3');

const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('https://ropsten.fundrequest.io'));
web3.eth.getTransactionReceiptMined = require("./getTransactionReceiptMined.js");

const p_key = process.env.PRIVATE_KEY;

const getAbi = require('./VestingWallet.js');


const solidityFunction = new SolidityFunction('', _.find(getAbi(), {name: 'registerVestingSchedule'}), '');

const doThings = function (address, depositor, start, cliff, end, amount, _callback) {
  var payload = [
    address,
    depositor,
    start,
    cliff,
    end,
    amount
  ];
  let payloadData = solidityFunction.toPayload(payload).data;

  web3.eth.getTransactionCount('0xc31Eb6E317054A79bb5E442D686CB9b225670c1D', function (_, nonce) {
    web3.eth.sendRawTransaction(sign({
      to: '0x3d0bdd62f1b7636ac28e9dd9c6580b68dd652884',
      value: 0,
      gas: 500000,
      data: payloadData,
      gasPrice: 8000000000,
      nonce: nonce
    }, p_key), function (_, txHash) {
      if (_) {
        console.log(_);
        _callback(null);
      } else {
        console.log('[sending] Transaction Hash', txHash);
        web3.eth.getTransactionReceiptMined(txHash).then(function (txHash) {
          console.log(txHash);
          _callback(txHash);
        });
      }
    });
  });
};


let iterate = function (lines) {
  let line = lines.pop();
  let schedules = line.split(",");
  if (schedules.length === 5) {
    let address = schedules[0];
    let start = schedules[1];
    let cliff = schedules[2];
    let end = schedules[3];
    let amount = schedules[4];
    let depositor = '0xc31Eb6E317054A79bb5E442D686CB9b225670c1D';

    let weiAmount = amount * Math.pow(10, 18);
    console.log('vesting tokens for ' + address + ' -> ' + weiAmount);

    doThings(address, depositor, start, cliff, end, amount, function (_callback) {
      console.log("Done for address: " + address);
      if (lines.length > 0) {
        iterate(lines);
      }
    });
  }
};

fs.readFile('csv/vesting-schedules.csv', 'utf8', function (err, data) {
  if (err) throw err;
  iterate(data.split('\n'));
});