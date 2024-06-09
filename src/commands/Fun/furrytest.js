const { Command } = require('@sapphire/framework');
const random = require('random');

class FurryTestCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'furrytest',
            aliases: ['ft'],
            description: 'How much of a furry are you?',
            detailedDescription: {
                usage: '(member)',
                example: '@thepoopwitch'
            }
        });
    }

    async messageRun(message, args) {
        const member = await args.pick('member').catch(() => null);
        const furryPercentage = random.int(0, 100);

        if (member && member.user.id === message.client.user.id) {
            return message.channel.send('What do you think big shot?');
        }

        let msg;

        if (!member || member.user.id === message.author.id) {
            msg = `You are **${furryPercentage}%** a furry!`;
        } else {
            msg = `${member.user.username} is **${furryPercentage}%** a furry!`;
        }

        switch (furryPercentage) {
        case 0:
            msg += ' A functioning member of society!';
            break;
        case 50:
            msg += ' A bit suspicious but... There\'s a chance to be saved still...';
            break;
        case 69:
            msg += ' Nice.';
            break;
        case 99:
            msg += ' ...';
            break;
        case 100:
            msg += ' ⚠️ **EVERYBODY EVACUATE THE BUILDING** ⚠️';
            break;
        }
        
        return message.channel.send(msg);
    }
}

module.exports = {
    FurryTestCommand
};
