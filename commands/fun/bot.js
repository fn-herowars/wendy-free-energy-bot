const { SlashCommandBuilder } = require('discord.js');
const Account = require('../../models/Account.js');
const webClient = require('../../web/wendys-shop-api-consumer.js');
const HttpStatus = require('../../web/http-status.js');

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
			const { statusCode, data } = await webClient.getPlayer(id);
			switch (statusCode) {
				case HttpStatus.OK: {
					persistAccount(data);
					return await reply(interaction, 'Hey ' + data.attributes.nickname + ' you are all set. Your free energy will be collected automatically.');
					break;
				} default: {
					return await reply(interaction, 'Sorry, I could not find the account for the ID: ' + id);
				}
			}
		} catch (error) {
			console.error(error);
			return await reply(interaction, 'Something went wrong, we are working to fix it!');
		}

	}
};

const persistAccount = async (data) => {
	await Account.upsert(data.attributes.platform_player_id, data.attributes.nickname);
}

const reply = async (interaction, message) => {
	return await interaction.reply({ content: message, ephemeral: true });
}