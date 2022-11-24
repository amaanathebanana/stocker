async function loadEvents(client) {
    const { fileLoader } = require("../functions/fileLoader");
    const ascii = require("ascii-table");
    const table = new ascii().setHeading("Events", "Status");

    await client.events.clear();
    const Files = await fileLoader("events")

    Files.forEach((file) => {
        const event = require(file);
        const execute = async (...args) => await event.execute(...args, client);
        client.events.set(event.name, execute)

        if (event.rest) {
            if (event.once) client.rest.once(event.name, execute);
            else
                client.rest.on(event.name, execute);
        } else {
            if (event.once) client.once(event.name, execute);
            else
                client.on(event.name, execute);
        }
        table.addRow(event.name, "🟩")
    })
    return console.log(table.toString(), "\nLoaded Events")
}

module.exports = { loadEvents }