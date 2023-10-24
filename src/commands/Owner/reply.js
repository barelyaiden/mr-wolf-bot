const { Command } = require('@sapphire/framework');

class ReplyCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'reply',
            aliases: ['r'],
            description: 'Make the bot reply to someone.',
            detailedDescription: {
                usage: '[message id] [message]',
                example: '941620203534553108 Hello, person!'
            },
            preconditions: ['OwnerOnly']
        });
    }

    async messageRun(message, args) {
        const messageId = await args.pick('string').catch(() => null);
        const messageToRepeat = args.finished ? '' : await args.rest('string');

        await message.delete();

        if (!messageId || !/\d/.test(messageId) || messageToRepeat.length < 1 && message.attachments.size < 1) {
            return;
        } else {
            const messageToReplyTo = await message.channel.messages.fetch(messageId);
            if (message.attachments.size < 1) return messageToReplyTo.reply(messageToRepeat);
            return messageToReplyTo.reply({ content: messageToRepeat, files: [message.attachments.first().proxyURL] });
        }
    }
}

module.exports = {
    ReplyCommand
};