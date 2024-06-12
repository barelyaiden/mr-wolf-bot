const { Listener } = require('@sapphire/framework');
const random = require('random');

class MessageCreateListener extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            event: 'messageCreate'
        });
    }

    async run(message) {
        if (message.author.bot) return;

        const randomChance = random.int(0, 100);

        if (randomChance <= 15) {
            let selfFagBucks = await message.client.FagBucks.findOne({ where: { userId: message.author.id } });

            if (!selfFagBucks) {
                await message.client.FagBucks.create({
                    userId: message.author.id,
                    amount: 100,
                    bank: 0
                });

                selfFagBucks = await message.client.FagBucks.findOne({ where: { userId: message.author.id } });
            }

            await selfFagBucks.update({ amount: selfFagBucks.amount + 10 });
        }
    }
}

module.exports = {
    MessageCreateListener
};
