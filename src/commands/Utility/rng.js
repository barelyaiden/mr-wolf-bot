const { Command } = require('@sapphire/framework');

class RNGCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'rng',
            description: 'Generate a random number within a given range.',
            detailedDescription: {
                usage: '[first number] [second number]',
                example: '10 40'
            }
        });
    }

    async messageRun(message, args) {
        const firstNumber = await args.pick('number').catch(() => 1);
        const secondNumber = await args.pick('number').catch(() => firstNumber + 99);
        return message.channel.send(`**[🎲]** ${Math.floor(Math.random() * (secondNumber - firstNumber + 1) + firstNumber)}`);
    }
}

module.exports = {
    RNGCommand
};
