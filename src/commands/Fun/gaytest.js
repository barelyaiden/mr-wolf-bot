const { Command } = require('@sapphire/framework');
const { AttachmentBuilder } = require('discord.js');

class GayTestCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'gaytest',
            aliases: ['gt'],
            description: 'How gay are you?',
            detailedDescription: {
                usage: '(member)',
                example: '@barelyaiden'
            }
        });
    }

    async messageRun(message, args) {
        const member = await args.pick('member').catch(() => null);
        const gayPercentage = Math.floor(Math.random() * 100);

        if (!member || member.user.id === message.author.id) return message.reply(`You are ${gayPercentage}% gay!`);

        if (member.user.id === message.client.user.id) {
            const attachment = new AttachmentBuilder('./assets/videos/iaintgay.mp4');
            return message.reply({ files: [attachment] });
        }
        
        return message.reply(`${member.user.username} is ${gayPercentage}% gay!`);
    }
}

module.exports = {
    GayTestCommand
};