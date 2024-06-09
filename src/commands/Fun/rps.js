const { Command } = require('@sapphire/framework');
const { Time } = require('@sapphire/time-utilities');
const random = require('random');
const commonMessages = require('../../utilities/commonMessages');

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

        if (!choice || !choices.includes(choice)) return commonMessages.sendUsageEmbed(this, message, args);

        const objects = ['Rock', 'Paper', 'Scissors'];
        const botChoice = objects[random.int(0, objects.length - 1)];

        let fagBucks = await message.client.FagBucks.findOne({ where: { userId: message.author.id } });

        if (!fagBucks) {
            await message.client.FagBucks.create({
                userId: message.author.id,
                amount: 100
            });

            fagBucks = await message.client.FagBucks.findOne({ where: { userId: message.author.id } });
        }

        const randomChance = random.int(0, 100);
        let winAmount = 15;

        if (randomChance <= 5) {
            winAmount = 90;
        } else if (randomChance <= 15) {
            winAmount = 60;
        } else if (randomChance <= 30) {
            winAmount = 30;
        }

        if (botChoice === 'Rock') {
            if (mapChoice[choice] === 'Rock') {
                return message.channel.send(`**[🪨]** Draw! You both chose **${botChoice}**!`);
            } else if (mapChoice[choice] === 'Paper') {
                await fagBucks.update({ amount: fagBucks.amount + winAmount });
                return message.channel.send(`**[🪨]** You won! The bot chose **${botChoice}**!\n**You win ${winAmount} 💵 FagBucks!**`);
            } else if (mapChoice[choice] === 'Scissors') {
                return message.channel.send(`**[🪨]** You lost! The bot chose **${botChoice}**!`);
            }
        } else if (botChoice === 'Paper') {
            if (mapChoice[choice] === 'Rock') {
                return message.channel.send(`**[📃]** You lost! The bot chose **${botChoice}**!`);
            } else if (mapChoice[choice] === 'Paper') {
                return message.channel.send(`**[📃]** Draw! You both chose **${botChoice}**!`);
            } else if (mapChoice[choice] === 'Scissors') {
                await fagBucks.update({ amount: fagBucks.amount + winAmount });
                return message.channel.send(`**[📃]** You won! The bot chose **${botChoice}**!\n**You win ${winAmount} 💵 FagBucks!**`);
            }
        } else if (botChoice === 'Scissors') {
            if (mapChoice[choice] === 'Rock') {
                await fagBucks.update({ amount: fagBucks.amount + winAmount });
                return message.channel.send(`**[✂️]** You won! The bot chose **${botChoice}**!\n**You win ${winAmount} 💵 FagBucks!**`);
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
