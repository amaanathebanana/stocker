module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        if (!interaction.isButton()) return;

        const button = client.buttons.get(interaction.customId);

        if (!button) return;

        if (button == undefined) return;

        if (button.developer && !interaction.user.id != "763277789125804073") {
            return interaction.reply({
                content: "You do not have access to this button!",
                ephemeral: true
            });
        }
        button.execute(interaction, client);
    }
}
