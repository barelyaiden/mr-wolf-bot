const { Command } = require('@sapphire/framework');

class BankCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'bank',
            description: 'Check your bank account balance!'
        });
    }

    async messageRun(message) {
        let selfFagBucks = await message.client.FagBucks.findOne({ where: { userId: message.author.id } });

        if (!selfFagBucks) {
            await message.client.FagBucks.create({
                userId: message.author.id,
                amount: 100,
                bank: 0
            });

            selfFagBucks = await message.client.FagBucks.findOne({ where: { userId: message.author.id } });
        }

        return message.channel.send(`You have **${selfFagBucks.bank.toLocaleString('en-US')} 💵 FagBucks** in your bank account!`);
    }
}

module.exports = {
    BankCommand
};
