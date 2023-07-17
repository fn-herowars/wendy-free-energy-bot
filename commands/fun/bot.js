const { SlashCommandBuilder } = require('discord.js');
const Account = require('../../models/Account.js');
const webClient = require('../../web/shop-requests.js');

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
			const data = await webClient.GetPlayer(id);
			const nickname = data.attributes.nickname;

			await Account.upsert(id, nickname);

			await interaction.reply({content: 'Hey ' + nickname + ' you are all set. Your free energy will be collected automatically.', ephemeral: true});
		} catch (error) {
			console.log(error);
			if (error.name === 'SequelizeUniqueConstraintError') {
				return interaction.reply('This account already exists in the database');
			}

			return interaction.reply('Something went wrong, we are working to fix it!');
		}

	},
};