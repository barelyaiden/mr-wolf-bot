const { Listener } = require('@sapphire/framework');
const { roles, channels } = require('../../config.json');

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
        await gatewayChannel.send(`**Welcome to the server ${member}!**\nMake sure to read the ${rulesChannel} and enjoy your stay!`);

        const mutedMember = await member.client.MutedMembers.findOne({ where: { userId: member.user.id } });
        const deadMember = await member.client.DeadMembers.findOne({ where: { userId: member.user.id } });

        if (mutedMember) {
            const mutedRole = await member.guild.roles.cache.find(role => role.name === roles.mutedRole);
            await member.roles.add(mutedRole);
        }

        if (deadMember) {
            const deadRole = await member.guild.roles.cache.find(role => role.name === roles.deadRole);
            await member.roles.add(deadRole);
            await member.setNickname(deadMember.nickname);
        }
    }
}

module.exports = {
    GuildMemberAddListener
};
