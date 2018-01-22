const VestingWalletTimeMock = artifacts.require('./vesting/VestingWalletTimeMock.sol');
const Token = artifacts.require('./erc20/StubToken.sol');

const expect = require('chai').expect;

contract('VestingWallet', function (accounts) {

	let token;
	let vesting;
	let owner = accounts[0];

	beforeEach(async function () {
		token = await Token.new('FundRequestToken', 'FND', 18, 100);
	});

	it('should not be possible to transfer if cliff is not yet reached', async function () {
		vesting = await VestingWalletTimeMock.new(token.address, 5);
		await token.transfer(vesting.address, 100, {from: owner});
		await vesting.registerVestingSchedule(accounts[2], owner, 1, 5, 10, 100, {from: owner});

		try {
			await vesting.withdraw({from: accounts[2]});
			assert.fail('withdraw should not have succeeded');
		} catch (error) {
			assertInvalidOpCode(error);
		}
	});

	it('should be possible to refund before cliff as owner', async function () {
		vesting = await VestingWalletTimeMock.new(token.address, 4);
		await token.transfer(vesting.address, 100, {from: owner});
		await vesting.registerVestingSchedule(accounts[2], owner, 1, 5, 10, 100, {from: owner});

		await vesting.endVesting(accounts[2], accounts[3]);
		expect((await token.balanceOf(accounts[3])).toNumber()).to.equal(100);
	});


	it('should be possible to refund after cliff as owner', async function () {
		vesting = await VestingWalletTimeMock.new(token.address, 4);
		await token.transfer(vesting.address, 100, {from: owner});
		await vesting.registerVestingSchedule(accounts[2], owner, 1, 5, 10, 100, {from: owner});

		await vesting.endVesting(accounts[2], accounts[3]);
		expect((await token.balanceOf(accounts[3])).toNumber()).to.equal(100);
	});

	it('should be possible to withdraw all of the allocation after the entire vesting period', async function () {
		vesting = await VestingWalletTimeMock.new(token.address, 1000);
		await token.transfer(vesting.address, 100, {from: owner});
		expect((await token.balanceOf(vesting.address)).toNumber()).to.equal(100);

		await vesting.registerVestingSchedule(accounts[2], owner, 1, 5, 10, 50, {from: owner});

		await vesting.withdraw({from: accounts[2]});
		expect((await token.balanceOf(accounts[2])).toNumber()).to.equal(50);
	});

	it('should be possible to withdraw part of the allocation after cliff time', async function () {
		vesting = await VestingWalletTimeMock.new(token.address, 51);
		await token.transfer(vesting.address, 100, {from: owner});
		expect((await token.balanceOf(vesting.address)).toNumber()).to.equal(100);

		await vesting.registerVestingSchedule(accounts[2], owner, 0, 50, 100, 100, {from: owner});

		await vesting.withdraw({from: accounts[2]});
		expect((await token.balanceOf(accounts[2])).toNumber()).to.equal(51);
	});


	it('should not be possible to withdraw the same amount twice', async function () {
		vesting = await VestingWalletTimeMock.new(token.address, 51);
		await token.transfer(vesting.address, 100, {from: owner});
		expect((await token.balanceOf(vesting.address)).toNumber()).to.equal(100);

		await vesting.registerVestingSchedule(accounts[2], owner, 0, 50, 100, 100, {from: owner});

		await vesting.withdraw({from: accounts[2]});
		await vesting.withdraw({from: accounts[2]});
		expect((await token.balanceOf(accounts[2])).toNumber()).to.equal(51);
	});

	it('should not be possible to withdraw the remaining balance after claiming a part (ended)', async function () {
		vesting = await VestingWalletTimeMock.new(token.address, 51);
		await token.transfer(vesting.address, 100, {from: owner});
		expect((await token.balanceOf(vesting.address)).toNumber()).to.equal(100);

		await vesting.registerVestingSchedule(accounts[2], owner, 0, 50, 100, 100, {from: owner});

		await vesting.withdraw({from: accounts[2]});

		await vesting.updateTime(200);
		await vesting.endVesting(accounts[2], accounts[3]);

		expect((await token.balanceOf(accounts[2])).toNumber()).to.equal(100);
	});

	it('should not be possible to withdraw the remaining balance after claiming a part (not ended)', async function () {
		vesting = await VestingWalletTimeMock.new(token.address, 51);
		await token.transfer(vesting.address, 100, {from: owner});
		expect((await token.balanceOf(vesting.address)).toNumber()).to.equal(100);

		await vesting.registerVestingSchedule(accounts[2], owner, 0, 50, 100, 100, {from: owner});

		await vesting.withdraw({from: accounts[2]});

		await vesting.endVesting(accounts[2], accounts[3]);

		expect((await token.balanceOf(accounts[2])).toNumber()).to.equal(51);
		expect((await token.balanceOf(accounts[3])).toNumber()).to.equal(49);
	});

	it('should not do anything when nothing withdrawable', async function () {
		await vesting.endVesting(accounts[2], accounts[3]);

		expect((await token.balanceOf(accounts[2])).toNumber()).to.equal(0);
		expect((await token.balanceOf(accounts[3])).toNumber()).to.equal(0);
	});

	it('should not be possible to end vesting as non-owner', async function () {
		try {
			await vesting.endVesting(accounts[2], accounts[3], {from: accounts[2]});
			assert.fail('shouldnt be able to end vesting as non-owner');
		} catch(error) {
			assertInvalidOpCode(error);
		}
	});

	it('should not be possible to end vesting and refund to an empty address', async function() {
		try {
			await vesting.endVesting(accounts[2], 0, {from: owner });
			assert.fail('shouldnt be possible to end vesting to a non-existent address');
		} catch(error) {
			assertInvalidOpCode(error);
		}
	});

	function assertInvalidOpCode(error) {
		assert(
			error.message.indexOf('VM Exception while processing transaction: revert') >= 0,
			'This should fail'
		);
	}
});
