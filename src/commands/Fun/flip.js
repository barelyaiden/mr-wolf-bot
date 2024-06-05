const { Command } = require('@sapphire/framework');

class FlipCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'flip',
            aliases: ['coinflip'],
            description: 'Flip a coin!'
        });
    }

    async messageRun(message) {
        const sides = ['Heads', 'Tails'];
        return message.channel.send(`**[🪙]** ${sides[Math.floor(Math.random() * sides.length)]}!`);
    }
}

module.exports = {
    FlipCommand
};
