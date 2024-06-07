const { Command } = require('@sapphire/framework');
const commonMessages = require('../../utilities/commonMessages');

class GiveCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'give',
            aliases: ['pay'],
            description: 'Give someone else some of your hard earned cash!',
            detailedDescription: {
                usage: '[member] [amount]',
                example: '@tannaers 100'
            }
        });
    }

    async messageRun(message, args) {
        const member = await args.pick('member').catch(() => null);
        const amount = await args.pick('number').catch(() => null);
        if (!member || !amount) return commonMessages.sendUsageEmbed(this, message, args);

        if (member.user.id === message.client.user.id) {
            return message.channel.send('You wanna give me money? THAT\'S MY MONEY!!!');
        } else if (member.user.bot) {
            return message.channel.send('Why would you wanna give a computer program money?');
        } else if (member.user.id === message.author.id) {
            return message.channel.send(`You just handed yourself **${amount} 💵 FagBucks**! Fascinating! Now you have exactly the same amount you had before.`);
        }

        const selfFagBucks = await message.client.FagBucks.findOne({ where: { userId: message.author.id } });
        if (amount > selfFagBucks.amount) return message.channel.send(`You only have **${selfFagBucks.amount} 💵 FagBucks**!`);

        let fagBucks = await message.client.FagBucks.findOne({ where: { userId: member.user.id } });

        if (!fagBucks) {
            await message.client.FagBucks.create({
                userId: message.author.id,
                amount: 100
            });

            fagBucks = await message.client.FagBucks.findOne({ where: { userId: member.user.id } });
        }

        await fagBucks.update({ amount: fagBucks.amount + amount });
        await selfFagBucks.update({ amount: selfFagBucks.amount - amount });
        return message.channel.send(`Successfully gave ${member.user.username} **${fagBucks.amount} 💵 FagBucks**!`);
    }
}

module.exports = {
    GiveCommand
};
