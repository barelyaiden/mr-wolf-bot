const { Command } = require('@sapphire/framework');

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
            return message.channel.send('I don\'t know 24:00 or something?');
        } else if (member.user.bot) {
            return message.channel.send('I don\'t... think... they know the time...?');
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
