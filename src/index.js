const { SapphireClient } = require('@sapphire/framework');
const { GatewayIntentBits, ActivityType } = require('discord.js');
const { token } = require('../config.json');

const client = new SapphireClient({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
    defaultPrefix: '!',
    loadMessageCommandListeners: true,
    presence: {
        activities: [{
            name: 'the gang rob a bank',
            type: ActivityType.Watching
        }]
    }
});

client.login(token);