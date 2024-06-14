const { Command } = require('@sapphire/framework');
const { sendUsageEmbed } = require('../../utilities/commonMessages');
const { fetchEconomyData } = require('../../utilities/economyFunctions');
const { isFloat } = require('../../utilities/typeCheckers');

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

        if (isFloat(amount) && amount > selfMoneys.amount) return message.channel.send(`You only have **${selfMoneys.amount.toLocaleString('en-US')} 💵 Moneys**!`);

        if (!isFloat(amount) && amount.toLowerCase() === 'all') {
            const allOfIt = selfMoneys.amount;
            await selfMoneys.update({ amount: selfMoneys.amount - allOfIt, bank: selfMoneys.bank + allOfIt });
            return message.channel.send(`Successfully deposited **${allOfIt.toLocaleString('en-US')} 💵 Moneys** into your bank account!`);
        } else {
            await selfMoneys.update({ amount: selfMoneys.amount - amount, bank: selfMoneys.bank + amount });
            return message.channel.send(`Successfully deposited **${amount.toLocaleString('en-US')} 💵 Moneys** into your bank account!`);
        }
    }
}

module.exports = {
    DepositCommand
};
