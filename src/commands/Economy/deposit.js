const { Command } = require('@sapphire/framework');
const commonMessages = require('../../utilities/commonMessages');

class DepositCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'deposit',
            description: 'Deposit money into your bank account for safekeeping!',
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

        if (amount > selfFagBucks.amount) return message.channel.send(`You only have **${selfFagBucks.amount.toLocaleString('en-US')} 💵 FagBucks**!`);

        await selfFagBucks.update({ amount: selfFagBucks.amount - amount, bank: selfFagBucks.bank + amount });
        return message.channel.send(`Successfully deposited **${amount.toLocaleString('en-US')} 💵 FagBucks** into your bank account!`);
    }
}

module.exports = {
    DepositCommand
};
