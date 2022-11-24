const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, Client, EmbedBuilder, CommandInteractionOptionResolver, IntegrationApplication } = require("discord.js");
const { api_key } = require('../../../config.json')
const userSchema = require('../../schemas/user')
const CC = require('currency-converter-lt');

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
        .setName("lookup")
        .setDescription("Lookup the price of a stock")
        .addStringOption(option => option.setName('symbol').setDescription("The symbol of the stock you want to lookup").setRequired(true)),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */

    async execute(interaction, client) {
        await interaction.deferReply();
        const symbol = interaction.options.getString('symbol');
        const url = `https://cloud.iexapis.com/stable/stock/${symbol}/quote?token=${api_key}`;
        const response = await fetch(url)
        if (response.status != 200) {
            await interaction.reply("Invalid Stock");
            return;
        }
        const data = await response.json();

        const companyName = data.companyName;
        let price = data.latestPrice
        const stocks = data.symbol;
        const database = await userSchema.findOne({ userId: interaction.user.id })
        let currencyConverter = new CC({ from: "USD", to: `${database.currency}` })
        price = await currencyConverter.convert(price)
        price = price.toLocaleString('en-us', {
            style: 'currency',
            currency: `${database.currency}`
        })

        const embed = new EmbedBuilder()
            .setTitle(`${companyName}`)
            .setColor('#C69B6D')
            .setDescription(`${stocks}`)
            .addFields(
                {
                    name: `Price`,
                    value: "`" + `${price}` + "`",
                    inline: true,
                },
                {
                    name: `\u200b`,
                    value: `\u200b`,
                    inline: true,
                }
            )
        interaction.editReply({
            embeds: [embed]
        })
    }
}


