const { ChatInputCommandInteraction, SlashCommandBuilder, Client, EmbedBuilder } = require("discord.js");
const userSchema = require('../../schemas/user')
const stockSchema = require('../../schemas/stock')
const { api_key } = require('../../../config.json');
const CC = require('currency-converter-lt');
module.exports = {
    finance: true,
    data: new SlashCommandBuilder()
        .setName("stocks")
        .setDescription("Shows the stocks that you have"),
    /**
 * @param {ChatInputCommandInteraction} interaction 
 * @param {Client} client 
 */
    async execute(interaction, client) {
        interaction.deferReply()
        const database = await userSchema.findOne({ userId: interaction.user.id })
        if (database) {
            let cash = await stockSchema.find({ userId: interaction.user.id })
            const embed = new EmbedBuilder()
                .setTitle("List of stocks that you own")
            let total = 0;
            for (let i in cash) {
                const url = `https://cloud.iexapis.com/stable/stock/${cash[i].stock}/quote?token=${api_key}`;
                const response = await fetch(url)
                const data = await response.json()
                let price;
                let currencyConverter = new CC({ from: "USD", to: `${database.currency}`, amount: data.latestPrice })
                const convert = await currencyConverter.convert(data.latestPrice)
                price = convert.toLocaleString('en-us', {
                    style: 'currency',
                    currency: `${database.currency}`,
                });

                embed.addFields({
                    name: `${data.companyName} | ${cash[i].stock}`, value: `${cash[i].amount}  | ${price}`
                })
                total += (data.latestPrice * cash[i].amount) 
            }
            let currencyConverter = new CC({ from: "USD", to: `${database.currency}`, amount: total })
            const convert = await currencyConverter.convert(total)
            total = convert.toLocaleString('en-us', {
                style: 'currency',
                currency: `${database.currency}`,
            });

            embed.addFields({
                name: `Total`, value: `${total}`
            })
            interaction.editReply({
                embeds: [embed]
            })
        }
        else {
            interaction.reply({
                content: "You do not have a trading account setup yet! Do `/register` to start!",
                ephemeral: true
            })
        }
    }
}
