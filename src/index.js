const { SapphireClient } = require('@sapphire/framework');
const { GatewayIntentBits, ActivityType } = require('discord.js');
const { Sequelize, DataTypes } = require('sequelize');
const { token, prefix } = require('../config.json');

const client = new SapphireClient({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
    defaultPrefix: prefix,
    loadMessageCommandListeners: true,
    presence: {
        activities: [{
            name: 'the gang rob a bank!',
            type: ActivityType.Watching
        }]
    }
});

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'databases/database.sqlite',
    logging: false
});

client.MutedMembers = sequelize.define('mutedMembers', {
    userId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    }
});

client.TimeZones = sequelize.define('timeZones', {
    userId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    timeZone: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

client.login(token);
