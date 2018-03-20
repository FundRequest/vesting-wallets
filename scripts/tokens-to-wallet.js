require('dotenv').config();
const fs = require('fs');
const sign = require('ethjs-signer').sign;
const SolidityFunction = require('web3/lib/web3/function');
const _ = require('lodash');
const Web3 = require('web3');

const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('https://mainnet.fundrequest.io'));
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

  web3.eth.getTransactionCount('0x3ad396DcB86d3a72855f7E1e305EaA144ec9b434', function (_, nonce) {
    web3.eth.sendRawTransaction(sign({
      to: '0x73B29c2a2Dd1c18Fe95cc43F67E5D202651794fE',
      value: 0,
      gas: 300000,
      data: payloadData,
      gasPrice: 4000000000,
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
  if (schedules.length === 2) {
    let address = schedules[0];
    let amount = schedules[1];
    let start = 1518566400;
    let cliff = 1534118400;
    let end = 1534118400;
    let depositor = '0x004F31991a12b24b4e69A33874936b5c94E2742D';

    let weiAmount = amount * Math.pow(10, 18);
    console.log('vesting tokens for ' + address + ' -> ' + weiAmount);

    doThings(address, depositor, start, cliff, end, weiAmount, function (_callback) {
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