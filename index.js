const { Client, GatewayIntentBits, Partials, Collection, Guild, IntentsBitField } = require("discord.js");
const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;
const config = require("./config.json");
const client = new Client({
    intents: [Guilds, GuildMembers, GuildMessages, IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessageReactions, IntentsBitField.Flags.GuildMembers], 
    partials: [User, Message, GuildMember, ThreadMember]
 }); 

const { loadEvents } = require("./src/handlers/eventHandler")
const { loadButtons } = require("./src/handlers/buttonHandler")

client.events = new Collection();
client.commands = new Collection();
client.buttons = new Collection();
loadEvents(client);
loadButtons(client);

client.login(config.token)