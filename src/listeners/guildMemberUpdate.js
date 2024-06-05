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
            return newMember.roles.add(guestRole);
        }
    }
}

module.exports = {
    GuildMemberUpdateListener
};
