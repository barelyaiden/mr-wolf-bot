const { Command } = require('@sapphire/framework');

class SayCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'say',
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

        await message.delete();

        if (messageToRepeat.length < 1 && message.attachments.size < 1) {
            return;
        } else {
            if (message.attachments.size < 1) return message.channel.send(messageToRepeat);
            return message.channel.send({ content: messageToRepeat, files: [message.attachments.first().proxyURL] });
        }
    }
}

module.exports = {
    SayCommand
};
