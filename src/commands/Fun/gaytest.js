const { Command } = require('@sapphire/framework');
const { owners } = require('../../../config.json');

class GayTestCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'gaytest',
            aliases: ['gt'],
            description: 'How gay are you?',
            detailedDescription: {
                usage: '(member)',
                example: '@zman4302'
            }
        });
    }

    async messageRun(message, args) {
        const member = await args.pick('member').catch(() => null);
        const gayPercentage = Math.floor(Math.random() * 100);

        if (!member && message.author.id === owners[0] || member && message.author.id === owners[0] && member.user.id === owners[0]) {
            return message.channel.send('YOU ARE THE MEGA GAY WOLF! **101% GAY!**');
        } else if (member && member.user.id === owners[0]) {
            return message.channel.send('BARELYAIDEN IS THE MEGA GAY WOLF! **101% GAY!**');
        } else if (member && member.user.id === message.client.user.id) {
            return message.channel.send('I AM THE MEGA GAY WOLF! **101% GAY!**');
        }

        let msg;

        if (!member || member.user.id === message.author.id) {
            msg = `You are ${gayPercentage}% gay!`;
        } else {
            msg = `${member.user.username} is ${gayPercentage}% gay!`;
        }

        switch (gayPercentage) {
        case 0:
            msg += ' Might as well be straight.';
            break;
        case 50:
            msg += ' Okay! Bisexual! I dig it!';
            break;
        case 69:
            msg += ' Nice.';
            break;
        case 99:
            msg += ' OOH SO CLOSE!';
            break;
        case 100:
            msg += ' **MEGA GAY**!';
            break;
        }
        
        return message.channel.send(msg);
    }
}

module.exports = {
    GayTestCommand
};