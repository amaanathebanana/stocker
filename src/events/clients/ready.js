const { loadCommands } = require("../../handlers/commandHandler");
const config = require("../../../config.json");
const mongoose = require("mongoose");

module.exports = { 
    name: "ready",
    once: true,
    execute(client) {
        mongoose.connect(config.databaseURL).then(() => console.log("Connected to MongoDB"));
        console.log("Stocker has logged in!")
        loadCommands(client)
    }
 }