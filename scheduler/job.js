const cron = require('node-cron');
const Account = require('../models/Account.js');
const webClient = require('../web/shop-requests.js');

Start = async () => {
	cron.schedule('0 * * * *', async () => {
		try {
			console.log('Starting the cron Job at: ' + new Date().toLocaleTimeString('nl-NL'));

			const accounts = await getAccountsNotRewardedToday();
			requestFreeEnergy(accounts);
		} catch(error) {
			console.error(error);
		}
	});
}

const requestFreeEnergy = async function (accounts) {
	for (const account of accounts) {
		const statusCode = await webClient.RequestFreeEnergy(account.accountId);
		if (statusCode == 200) {
			Account.upsertRewardTime(account.accountId, account.nickname, new Date());
		}
		console.log('Reward requested for: ' + account.nickname + ', returned \'' + statusCode + '\'');
	}	
}

const getAccountsNotRewardedToday = async () => {
	return await Account.findAllNotRewardedToday();	
}


module.exports = { Start };