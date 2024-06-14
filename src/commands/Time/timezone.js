const { Command } = require('@sapphire/framework');
const random = require('random');

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
            const responses = [
                'I... actually don\'t know.',
                'Do I even live in the physical world?',
                'I mean I think my server is located somewhere but I can\'t access that data.',
                'Maybe I\'m in `America/Los_Angeles!`',
                'Please stop asking.',
                '...'
            ];
            return message.channel.send(responses[random.int(0, responses.length - 1)]);
        } else if (member && member.user.bot) {
            const responses = [
                'Do bots even... live in countries?',
                'Do the other bots live in the physical world?',
                'Am I the only bot without all this info about the real world?',
                'I don\'t know maybe `Europe/Berlin`?',
                'Don\'t ask me.',
                'Enough.'
            ];
            return message.channel.send(responses[random.int(0, responses.length - 1)]);
        }

        const timeZone = await message.client.TimeZones.findOne({ where: { userId: member.id } });

        if (member && member === message.member) {
            if (!timeZone) return message.channel.send(`You did not register your time zone!\nUse the \`${prefix}settimezone\` command to get started.`);
        } else {
            if (!timeZone) return message.channel.send(`That member did not register their time zone!\nTell them to use the \`${prefix}settimezone\` command to get started.`);
        }

        if (member && member === message.member) {
            return message.channel.send(`Your current time zone is: \`${timeZone.timeZone}\``);
        } else {
            return message.channel.send(`${member.user.username}${(member.user.username.endsWith('s')) ? '\'' : '\'s'} current time zone is: \`${timeZone.timeZone}\``);
        }
    }
}

module.exports = {
    TimeZoneCommand
};
