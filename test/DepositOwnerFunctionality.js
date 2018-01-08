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

    it('should be possible to update depositOwner as owner', async function() {
        let originalDepositOwner = await vesting.depositOwner.call();
        expect(originalDepositOwner).to.equal(owner);
        await vesting.updateDepositOwner(accounts[1], { from: owner });
        let newDepositOwner = await vesting.depositOwner.call();
        expect(newDepositOwner).to.equal(accounts[1]);
    });
});
