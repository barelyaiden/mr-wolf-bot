const { Command } = require('@sapphire/framework');
const { Time } = require('@sapphire/time-utilities');
const { fetchEconomyData } = require('../../utilities/economyFunctions');

class DailyCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'daily',
            description: 'Get your daily allowance!',
            cooldownDelay: Time.Hour * 12
        });
    }

    async messageRun(message) {
        const selfMoneys = await fetchEconomyData(message, message.author.id);
        await selfMoneys.update({ amount: selfMoneys.amount + 100 });
        return message.channel.send('You have claimed your daily allowance of **100 💵 Moneys**!');
    }
}

module.exports = {
    DailyCommand
};
