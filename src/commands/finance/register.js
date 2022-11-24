const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, Client, EmbedBuilder } = require("discord.js");
const userSchema = require('../../schemas/user')
module.exports = {
    finance: true,
    data: new SlashCommandBuilder()
        .setName("register")
        .setDescription("Start a trading account"),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */

    async execute(interaction, client) {
        const database = await userSchema.findOne({ userId: interaction.user.id })
            if (!database) {
                const newDb = new userSchema({
                    userId: interaction.user.id,
                    cash: '10000',
                    currency: 'USD'
                })
                newDb.save()
                const embed = new EmbedBuilder()
                    .setTitle("Stocker")
                    .setDescription("The all in one discord paper trading bot.")
                    .addFields(
                        { name: 'Data Provided by IEX Cloud', value: `https://iexcloud.io` },
                    )
                    .setFooter({ text: "Made by Amaan#7467" })
                interaction.reply({
                    content: "Created an account for" + "`" + interaction.user.username + "#" + interaction.user.discriminator + "`",
                    embeds: [embed],
                    ephemeral: true
                })
            }
            else {
                interaction.reply({
                    content: "You already have an account!",
                    ephemeral: true
                })
            }
    }
}