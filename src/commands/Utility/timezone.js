const { Command } = require('@sapphire/framework');

class TimeZoneCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'timezone',
            description: 'View your or someone else\'s current time zone!',
            aliases: ['tz'],
            detailedDescription: {
                usage: '(member)',
                example: '@tsuvakas'
            }
        });
    }

    async messageRun(message, args) {
        const member = await args.pick('member').catch(() => message.member);
        const prefix = this.container.client.options.defaultPrefix;

        if (member && member.user.id === message.client.user.id) {
            return message.channel.send('I... actually don\'t know.');
        }

        const timeZone = await message.client.TimeZones.findOne({ where: { userId: member.id } });

        if (member === message.member) {
            if (!timeZone) return message.channel.send(`You did not register your time zone!\nUse the \`${prefix}settimezone\` command to get started.`);
        } else {
            if (!timeZone) return message.channel.send(`That member did not register their time zone!\nTell them to use the \`${prefix}settimezone\` command to get started.`);
        }

        if (member === message.member) {
            return message.channel.send(`Your current time zone is: \`${timeZone.timeZone}\``);
        } else {
            return message.channel.send(`${member.user.username}${(member.user.username.endsWith('s')) ? '\'' : '\'s'} current time zone is: \`${timeZone.timeZone}\``);
        }
    }
}

module.exports = {
    TimeZoneCommand
};
