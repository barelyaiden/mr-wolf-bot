const { Listener } = require('@sapphire/framework');

class MessageCreateListener extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            event: 'messageCreate'
        });
    }

    async run(message) {
        if (message.author.bot) return;

        const randomChance = Math.random() * 100;

        if (randomChance <= 15) {
            let fagBucks = await message.client.FagBucks.findOne({ where: { userId: message.author.id } });

            if (!fagBucks) {
                await message.client.FagBucks.create({
                    userId: message.author.id,
                    amount: 100
                });

                fagBucks = await message.client.FagBucks.findOne({ where: { userId: message.author.id } });
            }

            return fagBucks.update({ amount: fagBucks.amount + 10 });
        }
    }
}

module.exports = {
    MessageCreateListener
};
