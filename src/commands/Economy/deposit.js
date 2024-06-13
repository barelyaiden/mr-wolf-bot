const { Command } = require('@sapphire/framework');
const commonMessages = require('../../utilities/commonMessages');
const typeCheckers = require('../../utilities/typeCheckers');

class DepositCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'deposit',
            description: 'Deposit money into your bank account for safekeeping!',
            aliases: ['d'],
            detailedDescription: {
                usage: '[amount]',
                example: '5000'
            }
        });
    }

    async messageRun(message, args) {
        let amount = await args.pick('string').catch(() => null);
        if (!amount) return commonMessages.sendUsageEmbed(this, message, args);
        if (typeCheckers.isFloat(amount)) {
            amount = parseFloat(amount);
            if (isNaN(amount) || amount < 0) return commonMessages.sendUsageEmbed(this, message, args);
            if (amount % 1 != 0) return message.channel.send('You can only input whole numbers!');
        } else {
            if (amount.toLowerCase() !== 'all') return commonMessages.sendUsageEmbed(this, message, args);
        }

        const selfFagBucks = await message.client.FagBucks.findOne({ where: { userId: message.author.id } });

        if (!selfFagBucks) {
            await message.client.FagBucks.create({
                userId: message.author.id,
                amount: 100,
                bank: 0
            });

            selfFagBucks = await message.client.FagBucks.findOne({ where: { userId: message.author.id } });
        }

        if (typeCheckers.isFloat(amount) && amount > selfFagBucks.amount) return message.channel.send(`You only have **${selfFagBucks.amount.toLocaleString('en-US')} 💵 FagBucks**!`);

        if (!typeCheckers.isFloat(amount) && amount.toLowerCase() === 'all') {
            const allOfIt = selfFagBucks.amount;
            await selfFagBucks.update({ amount: selfFagBucks.amount - allOfIt, bank: selfFagBucks.bank + allOfIt });
            return message.channel.send(`Successfully deposited **${allOfIt.toLocaleString('en-US')} 💵 FagBucks** into your bank account!`);
        } else {
            await selfFagBucks.update({ amount: selfFagBucks.amount - amount, bank: selfFagBucks.bank + amount });
            return message.channel.send(`Successfully deposited **${amount.toLocaleString('en-US')} 💵 FagBucks** into your bank account!`);
        }
    }
}

module.exports = {
    DepositCommand
};
