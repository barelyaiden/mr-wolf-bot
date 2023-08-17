const { Command } = require('@sapphire/framework');

class SayCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'say',
            aliases: ['s'],
            description: 'Make the bot say something.',
            detailedDescription: {
                usage: '[message]',
                example: 'Hello, world!'
            },
            preconditions: ['OwnerOnly']
        });
    }

    async messageRun(message, args) {
        const messageToRepeat = args.finished ? '' : await args.rest('string');

        if (messageToRepeat.length < 1 && message.attachments.size < 1) {
            return message.delete();
        } else {
            await message.delete();
            if (message.attachments.size < 1) return message.channel.send(messageToRepeat);
            return message.channel.send({ content: messageToRepeat, files: [message.attachments.first().proxyURL] });
        }
    }
}

module.exports = {
    SayCommand
};