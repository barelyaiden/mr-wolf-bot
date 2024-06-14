const { Listener } = require('@sapphire/framework');
const random = require('random');
const { fetchEconomyData } = require('../utilities/economyFunctions');

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
            const selfMoneys = await fetchEconomyData(message, message.author.id);
            await selfMoneys.update({ amount: selfMoneys.amount + 10 });
        }
    }
}

module.exports = {
    MessageCreateListener
};
