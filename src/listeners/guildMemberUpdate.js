const { Listener } = require('@sapphire/framework');
const { roles } = require('../../config.json');

class GuildMemberUpdateListener extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            event: 'guildMemberUpdate'
        });
    }

    async run(oldMember, newMember) {
        if (oldMember.pending && !newMember.pending) {
            const guestRole = await newMember.guild.roles.cache.find(role => role.name === roles.guestRole);
            await newMember.roles.add(guestRole);
        }

        if (oldMember.nickname !== newMember.nickname) {
            const deadMember = await newMember.client.DeadMembers.findOne({ where: { userId: newMember.user.id } });
            if (deadMember) await newMember.setNickname(deadMember.nickname);
        }
    }
}

module.exports = {
    GuildMemberUpdateListener
};
