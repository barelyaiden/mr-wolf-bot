const { Command } = require('@sapphire/framework');
const nlp = require('compromise');

class EightBallCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: '8ball',
            aliases: ['8-ball'],
            description: 'Ask the magic 8-ball a question!',
            detailedDescription: {
                usage: '[question]',
                example: 'Will I get a $19 Fortnite card?'
            }
        });
    }

    async messageRun(message, args) {
        const question = await args.rest('string').catch(() => null);
        if (!question) return message.reply('🎱 What is your question for the magic 8-ball?');

        const questionValidation = nlp(question).questions().data().length === 1;

        if (!questionValidation) {
            return message.reply(`🎱 ${this.invalidAnswers[Math.floor(Math.random() * this.invalidAnswers.length)]}`);
        } else {
            return message.reply(`🎱 ${this.validAnswers[Math.floor(Math.random() * this.validAnswers.length)]}`);
        }
    }

    invalidAnswers = [
        'Hm?',
        'What?',
        'What do you mean?',
        'Could you repeat that?',
        'I didn\'t catch that.'
    ];

    validAnswers = [
        'It is certain!',
        'It is decidedly so!',
        'Without a doubt!',
        'Yes definitely!',
        'You may rely on it!',
        'As I see it, yes!',
        'Most likely!',
        'Outlook good!',
        'Yes!',
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