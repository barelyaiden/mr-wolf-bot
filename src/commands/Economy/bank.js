const { Command } = require('@sapphire/framework');
const { fetchEconomyData } = require('../../utilities/economyFunctions');

class BankCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'bank',
            description: 'Check your bank account balance!'
        });
    }

    async messageRun(message) {
        const selfMoneys = await fetchEconomyData(message, message.author.id);
        return message.channel.send(`You have **${selfMoneys.bank.toLocaleString('en-US')} 💵 Moneys** in your bank account!`);
    }
}

module.exports = {
    BankCommand
};
