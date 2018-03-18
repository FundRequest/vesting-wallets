const VestingWallet = artifacts.require('./vesting/VestingWallet.sol');
const Token = artifacts.require('./erc20/StubToken.sol');

const expect = require('chai').expect;

contract('VestingWallet', function (accounts) {

	let token;
	let vesting;
	let owner = accounts[0];
	let crowdsale = accounts[1];

	beforeEach(async function () {
		token = await Token.new('FundRequestToken', 'FND', 18, 1000 * Math.pow(10, 18));
		vesting = await VestingWallet.new(token.address);
	});

	it('should be possible to register a vesting schedule as owner', async function () {

		await token.approve(vesting.address, (10 * Math.pow(10, 18)));

		await vesting.registerVestingSchedule(accounts[2], crowdsale, 0, 20, 40, (10 * Math.pow(10, 18)), {from: owner});
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

	it('should not be possible to register if there is nothing approved', async function () {
		try {
			await vesting.registerVestingSchedule(accounts[2], crowdsale, 0, 20, 40, (10 * Math.pow(10, 18)), {from: owner});
			expect.fail('should not have been possible to register without approving first');
		} catch (error) {
			assert(
				error.message.indexOf('revert') >= 0,
				'executing as non_owner should fail.'
			);
		}
	});

	it('should not be possible to register if there is not enough approved', async function () {
		await token.approve(vesting.address, (10 * Math.pow(10, 18)));

		try {
			await vesting.registerVestingSchedule(accounts[2], crowdsale, 0, 20, 40, (20 * Math.pow(10, 18)), {from: owner});
			expect.fail('should not have been possible to register without approving enough first');
		} catch (error) {
			assert(
				error.message.indexOf('revert') >= 0,
				'executing as non_owner should fail.'
			);
		}
	});

	it('should not be possible to register a schedule as non-owner', async function () {
		await token.approve(vesting.address, (10 * Math.pow(10, 18)));

		try {
			let result = await vesting.registerVestingSchedule(accounts[2], crowdsale, 0, 20, 40, (10 * Math.pow(10, 18)), {from: crowdsale});
			expect.fail('should never be able to register as non-owner');
		} catch (error) {
			assert(
				error.message.indexOf('revert') >= 0,
				'executing as non_owner should fail.'
			);
		}
	});


	it('should not be possible to register a vesting schedule for 0-address', async function () {
		await token.approve(vesting.address, (10 * Math.pow(10, 18)));

		try {

			await vesting.registerVestingSchedule(accounts[2], '0x0000000000000000000000000000000000000000', 0, 20, 40, (10 * Math.pow(10, 18)), {from: owner});
			expect.fail('should never be able to register as 0-user');
		} catch (error) {
			assert(
				error.message.indexOf('revert') >= 0,
				'this should fail.'
			);
		}
	});


	it('should not be possible to register a vesting schedule with invalid times', async function () {
		await token.approve(vesting.address, (10 * Math.pow(10, 18)));

		try {
			let result = await vesting.registerVestingSchedule(accounts[2], crowdsale, 10, 9, 20, (10 * Math.pow(10, 18)), {from: owner});
			expect.fail('should never be able to register with a cliff time less than start-time');
		} catch (error) {
			assert(
				error.message.indexOf('revert') >= 0,
				'this should fail.'
			);
		}
	});

	it('should not be possible to register a vesting schedule with invalid times', async function () {
		await token.approve(vesting.address, (10 * Math.pow(10, 18)));

		try {
			let result = await vesting.registerVestingSchedule(accounts[2], crowdsale, 0, 40, 20, (10 * Math.pow(10, 18)), {from: owner});
			expect.fail('should never be able to register with an end time less than cliff-time');
		} catch (error) {
			assert(
				error.message.indexOf('revert') >= 0,
				'this should fail.'
			);
		}
	});


	it('is possible to register using a percentage', async function () {
		await token.approve(vesting.address, (10 * Math.pow(10, 18)));

		await vesting.registerVestingScheduleWithPercentage(accounts[3], crowdsale, 0, 1, 2, (10 * Math.pow(10, 18)), 50, {from: owner});
		let schedule = await vesting.schedules.call(accounts[3]);

		let startTimeInSec = schedule[0].toNumber();
		let cliffTimeInSec = schedule[1].toNumber();
		let endTimeInSec = schedule[2].toNumber();
		let totalAmount = schedule[3].toNumber();
		let totalAmountWithdrawn = schedule[4].toNumber();
		let depositor = schedule[5];

		expect(startTimeInSec).to.equal(0);
		expect(cliffTimeInSec).to.equal(1);
		expect(endTimeInSec).to.equal(2);
		expect(totalAmount).to.equal(5 * Math.pow(10, 18));
		expect(totalAmountWithdrawn).to.equal(0);
		expect(depositor).to.equal(crowdsale);
	});

	it('it should not be possible to invest with more than 100%', async function () {
		await token.approve(vesting.address, (10 * Math.pow(10, 18)));

		try {
			await vesting.registerVestingScheduleWithPercentage(accounts[3], crowdsale, 0, 1, 2, 1, 110, {from: owner});
		} catch (error) {
			assert(
				error.message.indexOf('revert') >= 0,
				'this should fail.'
			);
		}
	});

	it('should be possible to use 100%', async function () {
		await token.approve(vesting.address, (10 * Math.pow(10, 18)));

		await vesting.registerVestingScheduleWithPercentage(accounts[3], crowdsale, 0, 1, 2, 14, 100, {from: owner});
		let schedule = await vesting.schedules.call(accounts[3]);

		let totalAmount = schedule[3].toNumber();
		expect(totalAmount).to.equal(14);
	});

	it('should be rounded down when registering with undividable percentage', async function () {
		await token.approve(vesting.address, (10 * Math.pow(10, 18)));

		await vesting.registerVestingScheduleWithPercentage(accounts[3], crowdsale, 0, 1, 2, 1, 50, {from: owner});
		let schedule = await vesting.schedules.call(accounts[3]);

		let totalAmount = schedule[3].toNumber();
		expect(totalAmount).to.equal(0);
	});

	it('should not round with dividable percentage', async function () {
		await token.approve(vesting.address, (10 * Math.pow(10, 18)));

		let result = await vesting.registerVestingScheduleWithPercentage(accounts[4], crowdsale, 0, 1, 2, 2, 50, {from: owner});
		let schedule = await vesting.schedules.call(accounts[4]);

		let totalAmount = schedule[3].toNumber();
		expect(totalAmount).to.equal(1);
	});

	it('should by the sender\'s address by default', async function () {
		expect(await vesting.approvedWallet.call()).to.equal(owner);
	});

	it('should be possible to update approvedWallet', async function () {
		await vesting.setApprovedWallet(crowdsale);
		expect(await vesting.approvedWallet.call()).to.equal(crowdsale);
	});
});
