const { ChatInputCommandInteraction, SlashCommandBuilder, Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { api_key } = require('../../../config.json');
const CC = require('currency-converter-lt');
const userSchema = require('../../schemas/user')
const stockSchema = require('../../schemas/stock')

module.exports = {
    finance: true,
    data: new SlashCommandBuilder()
        .setName("buy")
        .setDescription("Buy a stock")
        .addStringOption(option => option.setName('symbol').setDescription("Symbol of the stock you want to buy").setRequired(true))
        .addIntegerOption(option => option.setName('amount').setDescription("The amount of shares you want to buy").setRequired(true)),
    /**
 * @param {ChatInputCommandInteraction} interaction 
 * @param {Client} client 
 */
    async execute(interaction, client) {
        const database = await userSchema.findOne({ userId: interaction.user.id })
        if (database) {
            interaction.deferReply()
            const symbol = interaction.options.getString('symbol');
            const amount = interaction.options.getInteger('amount');
            const url = `https://cloud.iexapis.com/stable/stock/${symbol}/quote?token=${api_key}`;
            let cash = database.cash
            const response = await fetch(url)
            if (response.status != 200) {
                await interaction.reply("Invalid Stock");
                return;
            }
            const data = await response.json();
            let price = data.latestPrice * amount;
            let currencyConverter = new CC({ from: "USD", to: `${database.currency}`, amount: amount })
            currencyConverter.convert(price).then((response) => {
                price = response.toLocaleString('en-us', {
                    style: 'currency',
                    currency: `${database.currency}`,
                });
                currencyConverter.convert(cash).then(async (response) => {
                    cash = response.toLocaleString('en-us', {
                        style: 'currency',
                        currency: `${database.currency}`,
                    });
                    if ((data.latestPrice * amount) > database.cash) {
                        const embed = new EmbedBuilder()
                            .setTitle(`You don't have enough money to buy ${amount} shares of ${data.companyName}`)
                            .setColor("#af1919")
                            .addFields(
                                {
                                    name: 'Costs:',
                                    value: `${price}`
                                },
                                {
                                    name: 'You have:',
                                    value: `${cash}`
                                },
                            )
                        interaction.editReply({
                            embeds: [embed]
                        })
                    }
                    else {
                        const mongoPrice = data.latestPrice * amount
                        const newCash = database.cash - mongoPrice
                        const stockDatabase = await stockSchema.findOne({ userId: interaction.user.id, stock: symbol })
                        if (stockDatabase) {
                            const newAmount = amount + stockDatabase.amount
                            await stockSchema.findOneAndUpdate({ userId: interaction.user.id, stock: symbol }, { amount: newAmount })
                            await userSchema.findOneAndUpdate({ userId: interaction.user.id }, { cash: newCash })
                        } else {
                            const newDb = new stockSchema({
                                userId: interaction.user.id,
                                stock: symbol,
                                amount: amount
                            })
                            newDb.save()
                            await userSchema.findOneAndUpdate({ userId: interaction.user.id }, { cash: newCash })
                        }
                        const embed = new EmbedBuilder()
                            .setTitle(`You bought ${amount} shares of ${data.companyName} for ${price}`)
                        interaction.editReply({
                            embeds: [embed],
                        })
                    }
                })
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
