const { ChatInputCommandInteraction, SlashCommandBuilder, Client } = require("discord.js");
const userSchema = require('../../schemas/user')
module.exports = {
    finance: true,
    data: new SlashCommandBuilder()
        .setName("currency")
        .setDescription("Change your default currency")
        .addStringOption(option => option.setName('currency').setDescription("The currency code you want to swap to").setRequired(true)),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */

    async execute(interaction, client) {
        const database = await userSchema.findOne({ userId: interaction.user.id })
        if (database) {
            const currency = interaction.options.getString('currency');
            const oldCurrency = database.currency
            var currency_code = ["AFA", "ALL", "DZD", "AOA", "ARS", "AMD", "AWG", "AUD", "AZN", "BSD", "BHD", "BDT", "BBD", "BYR", "BEF", "BZD", "BMD", "BTN", "BOB", "BAM", "BWP", "BRL", "GBP", "BND", "BGN", "BIF", "KHR", "CAD", "CVE", "KYD", "XOF", "XAF", "XPF", "CLP", "CNY", "COP", "KMF", "CDF", "CRC", "HRK", "CUC", "CZK", "DKK", "DJF", "DOP", "XCD", "EGP", "ERN", "EEK", "ETB", "EUR", "FKP", "FJD", "GMD", "GEL", "DEM", "GHS", "GIP", "GRD", "GTQ", "GNF", "GYD", "HTG", "HNL", "HKD", "HUF", "ISK", "INR", "IDR", "IRR", "IQD", "ILS", "ITL", "JMD", "JPY", "JOD", "KZT", "KES", "KWD", "KGS", "LAK", "LVL", "LBP", "LSL", "LRD", "LYD", "LTL", "MOP", "MKD", "MGA", "MWK", "MYR", "MVR", "MRO", "MUR", "MXN", "MDL", "MNT", "MAD", "MZM", "MMK", "NAD", "NPR", "ANG", "TWD", "NZD", "NIO", "NGN", "KPW", "NOK", "OMR", "PKR", "PAB", "PGK", "PYG", "PEN", "PHP", "PLN", "QAR", "RON", "RUB", "RWF", "SVC", "WST", "SAR", "RSD", "SCR", "SLL", "SGD", "SKK", "SBD", "SOS", "ZAR", "KRW", "XDR", "LKR", "SHP", "SDG", "SRD", "SZL", "SEK", "CHF", "SYP", "STD", "TJS", "TZS", "THB", "TOP", "TTD", "TND", "TRY", "TMT", "UGX", "UAH", "AED", "UYU", "USD", "UZS", "VUV", "VEF", "VND", "YER", "ZMK"];
            if (currency_code.includes(currency)) {
                await userSchema.findOneAndUpdate({ userId: interaction.user.id }, { currency: currency })
                interaction.reply({
                    content: "Changed your currency from `" + oldCurrency + "` to `" + currency + "`",
                })
            } else {
                interaction.reply(`Invalid Currency Code`);
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