const cron = require('node-cron');
const Account = require('../models/Account.js');
const WebClient = require('../web/wendys-shop-api-consumer.js');
const HttpStatus = require('../web/http-status.js');

Start = async () => {
	cron.schedule('0 4 * * *', async () => {
		try {
			console.log('Starting the cron Job at: ' + new Date().toLocaleTimeString('nl-NL'));
			const accounts = await getAccountsNotRewardedToday();
			accounts.every(requestRewardAndPersist);
		} catch(error) {
			console.error(error);
		}
	});
}

const requestRewardAndPersist = async (account) => {
	const statusCode = await WebClient.requestFreeEnergy(account.accountId);
	if (statusCode == HttpStatus.OK) {
		Account.upsertRewardTime(account.accountId, account.nickname, new Date());
	}
	console.log('Reward requested for: ' + account.nickname + ', returned \'' + statusCode + '\'');
}

const getAccountsNotRewardedToday = async () => {
	return await Account.findAllNotRewardedToday();	
}


module.exports = { Start };