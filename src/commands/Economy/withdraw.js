const { Command } = require('@sapphire/framework');
const commonMessages = require('../../utilities/commonMessages');

class WithdrawCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'withdraw',
            description: 'Withdraw money from your bank account!',
            detailedDescription: {
                usage: '[amount]',
                example: '5000'
            }
        });
    }

    async messageRun(message, args) {
        const amount = await args.pick('number').catch(() => null);
        if (!amount || isNaN(amount) || amount < 0) return commonMessages.sendUsageEmbed(this, message, args);
        if (amount % 1 != 0) return message.channel.send('You can only input whole numbers!');

        const selfFagBucks = await message.client.FagBucks.findOne({ where: { userId: message.author.id } });

        if (!selfFagBucks) {
            await message.client.FagBucks.create({
                userId: message.author.id,
                amount: 100,
                bank: 0
            });

            selfFagBucks = await message.client.FagBucks.findOne({ where: { userId: message.author.id } });
        }

        if (amount > selfFagBucks.bank) return message.channel.send(`You only have **${selfFagBucks.bank.toLocaleString('en-US')} 💵 FagBucks** in your bank account!`);

        await selfFagBucks.update({ amount: selfFagBucks.amount + amount, bank: selfFagBucks.bank - amount });
        return message.channel.send(`Successfully withdrew **${amount.toLocaleString('en-US')} 💵 FagBucks** from your bank account!`);
    }
}

module.exports = {
    WithdrawCommand
};
