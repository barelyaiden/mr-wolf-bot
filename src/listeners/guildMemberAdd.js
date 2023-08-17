const { Listener } = require('@sapphire/framework');
const { channels } = require('../../config.json');

class GuildMemberAddListener extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            event: 'guildMemberAdd'
        });
    }

    async run(member) {
        const gatewayChannel = await member.guild.channels.cache.find(ch => ch.name === channels.gatewayChannel);
        const rulesChannel = await member.guild.channels.cache.find(ch => ch.name === channels.rulesChannel);
        return gatewayChannel.send(`Welcome to the server ${member}! Make sure to read the ${rulesChannel} and enjoy your stay!`);
    }
}

module.exports = {
    GuildMemberAddListener
};