const VestingWallet = artifacts.require('./vesting/VestingWallet.sol');
const Token = artifacts.require('./erc20/StubToken.sol');

const expect = require('chai').expect;

contract('VestingWallet', async function (accounts) {

    let token;
    let vesting;
    let owner = accounts[0];
    let crowdsale = accounts[1];

    beforeEach (async function() {
        token = await Token.new('FundRequestToken', 'FND', 18, 0);
        vesting = await VestingWallet.new(token.address);
    });

    it('should be possible to register a vesting schedule as owner', async function() {
        let result = await vesting.registerVestingSchedule(accounts[2], crowdsale, 0,  20, 40, (10 * Math.pow(10, 18)),  { from: owner });
        let schedule = await vesting.schedules.call(accounts[2]);

        let startTimeInSec = schedule[0].toNumber();
        let cliffTimeInSec = schedule[1].toNumber();
        let endTimeInSec = schedule[2].toNumber();
        let totalAmount = schedule[3].toNumber();
        let totalAmountWithdrawn = schedule[4].toNumber();
        let depositor = schedule[5];

        expect(startTimeInSec).to.equal(0);
        expect(cliffTimeInSec).to.equal(20);
        expect(endTimeInSec).to.equal(40);
        expect(totalAmount).to.equal(10 * Math.pow(10, 18));
        expect(totalAmountWithdrawn).to.equal(0);
        expect(depositor).to.equal(crowdsale);
    });

    /*
    it('should not be possible to register a schedule as non-owner', async => {
        
    });


    it('should not be possible to register a vesting schedule for 0-address', async => {
        
    });

    it('should not be possible to register a vesting schedule with invalid times', async => {
        
    }); */
});
