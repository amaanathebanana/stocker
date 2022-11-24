const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, Client } = require("discord.js");
const { loadCommands } = require("../../handlers/commandHandler");
const { loadEvents } = require("../../handlers/eventHandler");
const { loadButtons } = require("../../handlers/buttonHandler");

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
        .setName("reload")
        .setDescription("Reload commands and events")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand((options) => options
            .setName("events")
            .setDescription("Reloads events"))
        .addSubcommand((options) => options
            .setName("commands")
            .setDescription("Reloads your commands"))
        .addSubcommand((options) => options
            .setName("buttons")
            .setDescription("Reloads buttons")),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    execute(interaction, client) {
        const subCommand = interaction.options.getSubcommand();

        switch (subCommand) {
            case "events": {
                for (const [key, value] of client.events)
                    client.removeListener(`${key}`, value, true);
                loadEvents(client);
                interaction.reply({
                    content: "Reloaded events",
                    ephemeral: true
                })
                console.log(`${interaction.user.id} triggered an event reload`)
            }
                break;
            case "commands": {
                loadCommands(client);
                interaction.reply({
                    content: "Reloaded commands",
                    ephemeral: true
                })
                console.log(`${interaction.user.id} triggered a command reload`)
            }
                break;
            case "buttons": {
                loadButtons(client);
                interaction.reply({
                    content: "Reloaded buttons",
                    ephemeral: true
                })
                console.log(`${interaction.user.id} triggered a button reload`)
            }
                break;
        }
    }
}