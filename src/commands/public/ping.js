const { ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Responds with the bot's ping"),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */

    execute(interaction){
        interaction.reply({
            content: "Pong"
        })
    }
}
