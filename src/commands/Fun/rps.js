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
                usage: '[choice]',
                example: 'paper'
            },
            cooldownDelay: Time.Minute,
            cooldownLimit: 10
        });
    }

    async messageRun(message, args) {
        const choice = await args.pick('string').catch(() => null);

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

        const objects = ['Rock', 'Paper', 'Scissors'];
        const botChoice = objects[random.int(0, objects.length - 1)];

        const selfMoneys = await fetchEconomyData(message, message.author.id);

        const randomChance = random.int(0, 100);
        let winAmount = 50;

        if (randomChance <= 5) {
            winAmount = 500;
        } else if (randomChance <= 15) {
            winAmount = 250;
        } else if (randomChance <= 30) {
            winAmount = 100;
        }

        if (botChoice === 'Rock') {
            if (mapChoice[choice] === 'Rock') {
                return message.channel.send(`**[🪨]** Draw! You both chose **${botChoice}**!`);
            } else if (mapChoice[choice] === 'Paper') {
                await selfMoneys.update({ amount: selfMoneys.amount + winAmount });
                return message.channel.send(`**[🪨]** You won! The bot chose **${botChoice}**!\n**You win ${winAmount} 💵 Moneys!**`);
            } else if (mapChoice[choice] === 'Scissors') {
                return message.channel.send(`**[🪨]** You lost! The bot chose **${botChoice}**!`);
            }
        } else if (botChoice === 'Paper') {
            if (mapChoice[choice] === 'Rock') {
                return message.channel.send(`**[📃]** You lost! The bot chose **${botChoice}**!`);
            } else if (mapChoice[choice] === 'Paper') {
                return message.channel.send(`**[📃]** Draw! You both chose **${botChoice}**!`);
            } else if (mapChoice[choice] === 'Scissors') {
                await selfMoneys.update({ amount: selfMoneys.amount + winAmount });
                return message.channel.send(`**[📃]** You won! The bot chose **${botChoice}**!\n**You win ${winAmount} 💵 Moneys!**`);
            }
        } else if (botChoice === 'Scissors') {
            if (mapChoice[choice] === 'Rock') {
                await selfMoneys.update({ amount: selfMoneys.amount + winAmount });
                return message.channel.send(`**[✂️]** You won! The bot chose **${botChoice}**!\n**You win ${winAmount} 💵 Moneys!**`);
            } else if (mapChoice[choice] === 'Paper') {
                return message.channel.send(`**[✂️]** You lost! The bot chose **${botChoice}**!`);
            } else if (mapChoice[choice] === 'Scissors') {
                return message.channel.send(`**[✂️]** Draw! You both chose **${botChoice}**!`);
            }
        }
    }
}

module.exports = {
    RpsCommand
};
