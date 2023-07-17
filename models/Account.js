const { Sequelize, Op } = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: './storage/database.sqlite',
});

const Account = sequelize.define('accounts', {
	accountId: {
		type: Sequelize.STRING,
		unique: true
	},
	nickname: {
		type: Sequelize.STRING
	},
	rewardedOn: {
		type: Sequelize.DATEONLY,
		allowNull: true
	}
});

const upsert = async (id, nickname) => {
	const [ account, created ] = await Account.upsert({
				accountId: id,
				nickname: nickname,
				rewardedOn: null
			});
	return account;
};

const upsertRewardTime = async (id, nickname, date) => {
	return [account, created] = await Account.upsert({
				accountId: id,
				nickname: nickname,
				rewardedOn: date
			});
};

const findAllNotRewardedToday = async () => {
	const accounts = await Account.findAll({
		where: {
			rewardedOn: {
				[Op.or]: {
					[Op.eq]: null,
					[Op.lt]: new Date()
				}
			}
		}
	});
	return accounts;
};

module.exports = { Account, upsert, upsertRewardTime, findAllNotRewardedToday};