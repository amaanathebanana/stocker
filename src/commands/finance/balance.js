const { ChatInputCommandInteraction, SlashCommandBuilder, Client } = require("discord.js");
const CC = require('currency-converter-lt');
const userSchema = require('../../schemas/user')
module.exports = {
    finance: true,
    data: new SlashCommandBuilder()
        .setName("balance")
        .setDescription("Shows how much money you have"),
    /**
 * @param {ChatInputCommandInteraction} interaction 
 * @param {Client} client 
 */
    async execute(interaction, client) {
        interaction.deferReply()
        const database = await userSchema.findOne({ userId: interaction.user.id })
        if (database) {
            let cash = database.cash
            let currencyConverter = new CC({ from: "USD", to: `${database.currency}` })
            currencyConverter.convert(cash).then((response) => {
                cash = response.toLocaleString('en-us', {
                    style: 'currency',
                    currency: `${database.currency}`,
                });
                interaction.editReply({
                    content: `Your current balance is ${cash}`
                })
            })
        }
        else {
            interaction.editReply({
                content: "You do not have a trading account setup yet! Do `/register` to start!",
                ephemeral: true
        })
        }
    }
}
