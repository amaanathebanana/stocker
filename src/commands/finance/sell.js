const { ChatInputCommandInteraction, SlashCommandBuilder, Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { api_key } = require('../../../config.json');
const CC = require('currency-converter-lt');
const userSchema = require('../../schemas/user')
const stockSchema = require('../../schemas/stock')

module.exports = {
    finance: true,
    data: new SlashCommandBuilder()
        .setName("sell")
        .setDescription("sell a stock")
        .addStringOption(option => option.setName('symbol').setDescription("Symbol of the stock you want to sell").setRequired(true))
        .addIntegerOption(option => option.setName('amount').setDescription("The amount of shares you want to sell").setRequired(true)),
    /**
 * @param {ChatInputCommandInteraction} interaction 
 * @param {Client} client 
 */
    async execute(interaction, client) {
        const userDatabase = await userSchema.findOne({ userId: interaction.user.id })
        if (userDatabase) {
            interaction.deferReply()
            const symbol = interaction.options.getString('symbol');
            const amount = interaction.options.getInteger('amount');
            const stockDatabase = await stockSchema.findOne({ userId: interaction.user.id, stock: symbol })
            const url = `https://cloud.iexapis.com/stable/stock/${symbol}/quote?token=${api_key}`;
            let cash = userDatabase.cash
            let currency = userDatabase.currency
            const response = await fetch(url)
            if (response.status != 200) {
                await interaction.reply("Invalid Stock");
                return;
            }
            const data = await response.json();
            let getAmount;
            if (!stockDatabase) { getAmount = 0 } else { getAmount = stockDatabase.amount }
            if (amount > stockDatabase.amount) {
                const embed = new EmbedBuilder()
                    .setTitle(`You don't have ${amount} share(s) of ${data.companyName}`)
                    .setColor("#af1919")
                    .addFields(
                        {
                            name: `How much you're selling:`,
                            value: `${amount}`
                        },
                        {
                            name: 'You have:',
                            value: `${getAmount}`
                        },
                    )
                interaction.editReply({
                    embeds: [embed]
                })
            }
            else {
                let price = data.latestPrice * amount;
                if (amount >= getAmount) {
                    let newCash = userDatabase.cash + price
                    await userSchema.findOneAndUpdate({ userId: interaction.user.id }, { cash: newCash })
                    await stockSchema.findOneAndDelete({ userId: interaction.user.id, stock: symbol })
                } else {
                    let newAmount = getAmount - amount 
                    let newCash = userDatabase.cash + price
                    await userSchema.findOneAndUpdate({ userId: interaction.user.id }, { cash: newCash })
                    await stockSchema.findOneAndUpdate({ userId: interaction.user.id, stock: symbol }, { amount: newAmount })
                }
                let currencyConverter = new CC({ from: "USD", to: `${currency}` })
                currencyConverter.convert(price).then((response) => {
                    price = response.toLocaleString('en-us', {
                        style: 'currency',
                        currency: `${currency}`,
                    });
                    currencyConverter.convert(cash).then((response) => {
                        cash = response.toLocaleString('en-us', {
                            style: 'currency',
                            currency: `${currency}`,
                        });
                        const embed2 = new EmbedBuilder()
                            .setTitle(`You sold ${amount} shares of ${data.companyName} for ${price}`)
                        interaction.editReply({
                            embeds: [embed2],
                        })
                    })
                })
            }
        }
        else {
            interaction.reply({
                content: "You do not have a trading account setup yet! Do `/register` to start!",
                ephemeral: true
            })
        }
    }
}