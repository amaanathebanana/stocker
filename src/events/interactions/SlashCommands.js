const { ChatInputCommandInteraction } = require("discord.js");
module.exports = {
    name: "interactionCreate",
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;
        const command = client.commands.get(interaction.commandName);
        if (!command)
            return interaction.reply({
                content: "This command doesn't exist! Report this to a staff member",
                ephemeral: true
            });

        if (command.developer && interaction.user.id !== "763277789125804073")
            return interaction.reply({
                content: "You do not have access to this command!",
                ephemeral: true
            });
        command.execute(interaction, client);
    }
}