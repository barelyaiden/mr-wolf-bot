const { Command } = require('@sapphire/framework');

class FurryTestCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'furrytest',
            aliases: ['ft'],
            description: 'How much of a furry you?',
            detailedDescription: {
                usage: '(member)',
                example: '@barelyaiden'
            }
        });
    }

    async messageRun(message, args) {
        const member = await args.pick('member').catch(() => null);
        const furryPercentage = Math.floor(Math.random() * 100);

        if (!member || member.user.id === message.author.id) return message.reply(`You are ${furryPercentage}% a furry!`);

        if (member.user.id === message.client.user.id) {
            return message.reply('What do you think big shot?');
        }
        
        return message.reply(`${member.user.username} is ${furryPercentage}% a furry!`);
    }
}

module.exports = {
    FurryTestCommand
};