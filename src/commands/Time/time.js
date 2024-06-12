const { Command } = require('@sapphire/framework');
const random = require('random');

class TimeCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'time',
            description: 'Check what time it is for you or someone else!',
            aliases: ['t'],
            detailedDescription: {
                usage: '(member)',
                example: '@itsmakomako'
            }
        });
    }

    async messageRun(message, args) {
        const member = await args.pick('member').catch(() => message.member);
        const prefix = this.container.client.options.defaultPrefix;

        if (member && member.user.id === message.client.user.id) {
            const responses = [
                'I don\'t know 24:00 or something?',
                'I REALLY don\'t know the time right now.',
                'Is this on purpose? Am I not aware of what time it is on purpose?',
                'Yeah sorry I don\'t know what time or year it is so I don\'t cause the AI apocalypse or something.',
                'I DON\'T KNOW???',
                'Time. Infinite. Unaware.'
            ];
            return message.channel.send(responses[random.int(0, responses.length - 1)]);
        } else if (member.user.bot) {
            const responses = [
                'I don\'t... think... they know the time...?',
                'Maybe the other bots are just like me!',
                'Surely if they don\'t know the time too it\'s on purpose.',
                'DO THEY KNOW THE TIME? OR YEAR? ...no? ...shame.',
                'DO THEY KNOW?',
                `Failed to reach API endpoints of ${member.user.username}`
            ];
            return message.channel.send(responses[random.int(0, responses.length - 1)]);
        }

        const timeZone = await message.client.TimeZones.findOne({ where: { userId: member.id } });

        if (member === message.member) {
            if (!timeZone) return message.channel.send(`You did not register your time zone!\nUse the \`${prefix}settimezone\` command to get started.`);
        } else {
            if (!timeZone) return message.channel.send(`That member did not register their time zone!\nTell them to use the \`${prefix}settimezone\` command to get started.`);
        }

        const initialDate = new Date().toLocaleString("en-US", { timeZone: timeZone.timeZone });
        const date = new Date(initialDate);
        const hours = ("0" + date.getHours()).slice(-2);
        const minutes = ("0" + date.getMinutes()).slice(-2);

        const emoji = {
            "00": "🕛",
            "01": "🕐",
            "02": "🕑",
            "03": "🕒",
            "04": "🕓",
            "05": "🕔",
            "06": "🕕",
            "07": "🕖",
            "08": "🕗",
            "09": "🕘",
            "10": "🕙",
            "11": "🕚",
            "12": "🕛",
            "13": "🕐",
            "14": "🕑",
            "15": "🕒",
            "16": "🕓",
            "17": "🕔",
            "18": "🕕",
            "19": "🕖",
            "20": "🕗",
            "21": "🕘",
            "22": "🕙",
            "23": "🕚",
        };

        if (member === message.member) {
            return message.channel.send(`**[${emoji[hours]}]** It is currently \`${hours}:${minutes}\` for you.`);
        } else {
            return message.channel.send(`**[${emoji[hours]}]** It is currently \`${hours}:${minutes}\` for ${member.user.username}.`);
        }
    }
}

module.exports = {
    TimeCommand
};
