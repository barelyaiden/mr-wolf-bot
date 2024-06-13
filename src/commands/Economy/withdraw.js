const { Command } = require('@sapphire/framework');
const commonMessages = require('../../utilities/commonMessages');
const typeCheckers = require('../../utilities/typeCheckers');

class WithdrawCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'withdraw',
            description: 'Withdraw money from your bank account!',
            aliases: ['w'],
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

        if (typeCheckers.isFloat(amount) && amount > selfFagBucks.bank) return message.channel.send(`You only have **${selfFagBucks.bank.toLocaleString('en-US')} 💵 FagBucks** in your bank account!`);

        if (!typeCheckers.isFloat(amount) && amount.toLowerCase() === 'all') {
            const allOfIt = selfFagBucks.bank;
            await selfFagBucks.update({ amount: selfFagBucks.amount + allOfIt, bank: selfFagBucks.bank - allOfIt });
            return message.channel.send(`Successfully withdrew **${allOfIt.toLocaleString('en-US')} 💵 FagBucks** from your bank account!`);
        } else {
            await selfFagBucks.update({ amount: selfFagBucks.amount + amount, bank: selfFagBucks.bank - amount });
            return message.channel.send(`Successfully withdrew **${amount.toLocaleString('en-US')} 💵 FagBucks** from your bank account!`);
        }
    }
}

module.exports = {
    WithdrawCommand
};
