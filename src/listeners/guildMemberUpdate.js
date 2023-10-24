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
            const visitorRole = await newMember.guild.roles.cache.find(role => role.name === roles.visitorRole);
            return newMember.roles.add(visitorRole);
        }
    }
}

module.exports = {
    GuildMemberUpdateListener
};