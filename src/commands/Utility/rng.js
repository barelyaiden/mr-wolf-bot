const { Command } = require('@sapphire/framework');
const random = require('random');

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
        if (firstNumber % 1 != 0 || secondNumber % 1 != 0) return message.channel.send('You can only input whole numbers!');
        return message.channel.send(`**[🎲]** ${(random.int(firstNumber, secondNumber)).toLocaleString('en-US')}`);
    }
}

module.exports = {
    RNGCommand
};
