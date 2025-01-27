const { SapphireClient } = require('@sapphire/framework');
const { GatewayIntentBits, ActivityType } = require('discord.js');
const { Sequelize, DataTypes } = require('sequelize');
const { token, prefix } = require('../config.json');

const client = new SapphireClient({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
    defaultPrefix: prefix,
    loadMessageCommandListeners: true,
    presence: {
        activities: [{
            name: 'the gang rob a bank!',
            type: ActivityType.Watching
        }]
    }
});

client.initialTimestamp = new Date();

client.sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'databases/database.sqlite',
    logging: false
});

client.MutedMembers = client.sequelize.define('mutedMembers', {
    userId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    }
});

client.TimeZones = client.sequelize.define('timeZones', {
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

client.Moneys = client.sequelize.define('moneys', {
    userId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    bank: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

client.DeadMembers = client.sequelize.define('deadMembers', {
    userId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    nickname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    originalNickname: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

client.MovieList = client.sequelize.define('movieList', {
    movieName: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    }
});

client.login(token);
