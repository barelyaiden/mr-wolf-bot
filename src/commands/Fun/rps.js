const { Command } = require('@sapphire/framework');
const { Time } = require('@sapphire/time-utilities');
const random = require('random');
const { sendUsageEmbed } = require('../../utilities/commonMessages');
const { fetchEconomyData } = require('../../utilities/economyFunctions');

class RpsCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'rps',
            aliases: ['rockpaperscissors'],
            description: 'Play Rock Paper Scissors with the bot!',
            detailedDescription: {
                usage: '[choice] (amount)',
                example: 'paper 500'
            },
            cooldownDelay: Time.Minute,
            cooldownLimit: 10
        });
    }

    async messageRun(message, args) {
        const choice = await args.pick('string').catch(() => null);
        const amount = await args.pick('number').catch(() => null);

        const choices = ['rock', 'r', 'paper', 'p', 'scissors', 's'];
        const mapChoice = {
            'rock': 'Rock',
            'r': 'Rock',
            'paper': 'Paper',
            'p': 'Paper',
            'scissors': 'Scissors',
            's': 'Scissors'
        };

        if (!choice || !choices.includes(choice)) return sendUsageEmbed(this, args, message);
        if (amount) {
            if (isNaN(amount)) return sendUsageEmbed(this, args, message);
            if (amount < 0) return message.channel.send('You can only input positive numbers!');
            if (amount % 1 != 0) return message.channel.send('You can only input whole numbers!');
            if (amount > 1000) return message.channel.send('You can only gamble up to a maximum of **1,000 💵 Moneys**!');
        }

        const objects = ['Rock', 'Paper', 'Scissors'];
        const botChoice = objects[random.int(0, objects.length - 1)];

        const selfMoneys = await fetchEconomyData(message, message.author.id);

        if (amount && amount > selfMoneys.amount) return message.channel.send(`You only have **${selfMoneys.amount.toLocaleString('en-US')} 💵 Moneys**!`);

        const randomChance = random.int(0, 100);
        let winAmount;
        let hasWon = false;
        let msg;

        if (!amount) {
            winAmount = 50;

            if (randomChance <= 5) {
                winAmount = 500;
            } else if (randomChance <= 15) {
                winAmount = 250;
            } else if (randomChance <= 30) {
                winAmount = 100;
            }
        } else {
            winAmount = amount * 2;

            if (randomChance <= 15) {
                winAmount = amount * 4;
            } else if (randomChance <= 35) {
                winAmount = amount * 3;
            }
        }

        if (botChoice === 'Rock') {
            if (mapChoice[choice] === 'Rock') {
                msg = `**[🪨]** Draw! You both chose **${botChoice}**!`;
            } else if (mapChoice[choice] === 'Paper') {
                hasWon = true;
                msg = `**[🪨]** You won! The bot chose **${botChoice}**!`;
            } else if (mapChoice[choice] === 'Scissors') {
                msg = `**[🪨]** You lost! The bot chose **${botChoice}**!`;
            }
        } else if (botChoice === 'Paper') {
            if (mapChoice[choice] === 'Rock') {
                msg = `**[📃]** You lost! The bot chose **${botChoice}**!`;
            } else if (mapChoice[choice] === 'Paper') {
                msg = `**[📃]** Draw! You both chose **${botChoice}**!`;
            } else if (mapChoice[choice] === 'Scissors') {
                hasWon = true;
                msg = `**[📃]** You won! The bot chose **${botChoice}**!`;
            }
        } else if (botChoice === 'Scissors') {
            if (mapChoice[choice] === 'Rock') {
                hasWon = true;
                msg = `**[✂️]** You won! The bot chose **${botChoice}**!`;
            } else if (mapChoice[choice] === 'Paper') {
                msg = `**[✂️]** You lost! The bot chose **${botChoice}**!`;
            } else if (mapChoice[choice] === 'Scissors') {
                msg = `**[✂️]** Draw! You both chose **${botChoice}**!`;
            }
        }

        if (!amount) {
            if (hasWon) {
                await selfMoneys.update({ amount: selfMoneys.amount + winAmount });
                msg += `\n**You win ${winAmount} 💵 Moneys!**`;
            }
        } else {
            if (hasWon) {
                await selfMoneys.update({ amount: (selfMoneys.amount - amount) + winAmount });
                msg += `\n**You gained ${(winAmount - amount).toLocaleString('en-US')} 💵 Moneys!**`;
            } else {
                await selfMoneys.update({ amount: selfMoneys.amount - amount });
                msg += `\n**You lost ${amount.toLocaleString('en-US')} 💵 Moneys!**`;
            }
        }

        return message.channel.send(msg);
    }
}

module.exports = {
    RpsCommand
};
