const { Command } = require('@sapphire/framework');
const commonMessages = require('../../utilities/commonMessages');

class ChooseCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'choose',
            description: 'Choose a random item from a given list.',
            detailedDescription: {
                usage: '[list of items separated by commas]',
                example: 'apple, orange, banana, grapes'
            }
        });
    }

    async messageRun(message, args) {
        const input = await args.rest('string').catch(() => null);
        if (!input) return commonMessages.sendUsageEmbed(this, message, args);
        const items = input.split(', ');
        if (items.length < 2) return message.channel.send(`I choose the only possible option: **${items[0]}**`);
        return message.channel.send(`I choose: **${items[Math.floor(Math.random() * items.length)]}**`);
    }
}

module.exports = {
    ChooseCommand
};
