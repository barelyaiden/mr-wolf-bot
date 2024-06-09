const { Command } = require('@sapphire/framework');
const random = require('random');

class EightBallCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: '8ball',
            aliases: ['eightball'],
            description: 'Ask the magic 8-ball a question!',
            detailedDescription: {
                usage: '[question]',
                example: 'Will I get a $19 Fortnite card?'
            }
        });
    }

    async messageRun(message, args) {
        const question = await args.rest('string').catch(() => null);
        if (!question) return message.channel.send('**[🎱]** What is your question for the magic 8-ball?');
        return message.channel.send(`**[🎱]** ${this.validAnswers[random.int(0, this.validAnswers.length - 1)]}`);
    }

    validAnswers = [
        'It is certain!',
        'It is decidedly so!',
        'Without a doubt!',
        'Yes definitely!',
        'You may rely on it!',
        'As I see it, yes!',
        'Most likely!',
        'Outlook good!',
        'Well yes!',
        'Signs point to yes!',
        'Reply hazy, try again.',
        'Ask again later.',
        'Better not tell you now.',
        'Cannot predict now.',
        'Concentrate and ask again.',
        'Don\'t count on it.',
        'My reply is no.',
        'My sources say no.',
        'Outlook not so good.',
        'Very doubtful.'
    ];
}

module.exports = {
    EightBallCommand
};
