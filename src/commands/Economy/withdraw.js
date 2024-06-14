const { Command } = require('@sapphire/framework');
const { sendUsageEmbed } = require('../../utilities/commonMessages');
const { fetchEconomyData } = require('../../utilities/economyFunctions');
const { isFloat } = require('../../utilities/typeCheckers');

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
        if (!amount) return sendUsageEmbed(this, args, message);

        if (isFloat(amount)) {
            amount = parseFloat(amount);
            if (amount < 0) {
                return message.channel.send('You can only input positive numbers!');
            } else if (amount % 1 != 0) {
                return message.channel.send('You can only input whole numbers!');
            }
        } else {
            if (amount.toLowerCase() !== 'all') return sendUsageEmbed(this, args, message);
        }

        const selfMoneys = await fetchEconomyData(message, message.author.id);

        if (isFloat(amount) && amount > selfMoneys.bank) return message.channel.send(`You only have **${selfMoneys.bank.toLocaleString('en-US')} 💵 Moneys** in your bank account!`);

        if (!isFloat(amount) && amount.toLowerCase() === 'all') {
            const allOfIt = selfMoneys.bank;
            await selfMoneys.update({ amount: selfMoneys.amount + allOfIt, bank: selfMoneys.bank - allOfIt });
            return message.channel.send(`Successfully withdrew **${allOfIt.toLocaleString('en-US')} 💵 Moneys** from your bank account!`);
        } else {
            await selfMoneys.update({ amount: selfMoneys.amount + amount, bank: selfMoneys.bank - amount });
            return message.channel.send(`Successfully withdrew **${amount.toLocaleString('en-US')} 💵 Moneys** from your bank account!`);
        }
    }
}

module.exports = {
    WithdrawCommand
};
