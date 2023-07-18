const { SlashCommandBuilder } = require('discord.js');
const Account = require('../../models/Account.js');
const webClient = require('../../web/wendys-shop-api-consumer.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wendy-gift')
		.setDescription("Wendy's daily shop gift")
		.addStringOption(option =>
			option.setName('account-id')
				.setDescription('Your Account ID')
				.setRequired(true)),

	async execute(interaction) {
		const id = interaction.options.getString('account-id');
		try {	
			const { statusCode, data } = await webClient.GetPlayer(id);
			if (isNotValidResponse(statusCode)) {
				return reply(interaction, 'The account ID: ' + id + ' is invalid.');
			}
			const nickname = data.attributes.nickname;
			persistAccount(id, nickname);
			return reply(interaction, 'Hey ' + nickname + ' you are all set. Your free energy will be collected automatically.');
		} catch (error) {
			console.log(error);
			if (error.name === 'SequelizeUniqueConstraintError') {
				return reply(interaction, 'This account already exists in the database')
			}
			return reply(interaction, 'Something went wrong, we are working to fix it!');
		}

	}
};

const isNotValidResponse = (statusCode) => {
	return statusCode != webClient.HttpStatus.OK;
}

const persistAccount = async (id, nickname) => {
	await Account.upsert(id, nickname);
}

const reply = async (interaction, message) => {
	return await interaction.reply({ content: message, ephemeral: true });
}