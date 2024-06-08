const { Command } = require('@sapphire/framework');
const { Time } = require('@sapphire/time-utilities');

class DailyCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'daily',
            description: 'Get your daily allowance!',
            cooldownDelay: Time.Day
        });
    }

    async messageRun(message) {
        let fagBucks = await message.client.FagBucks.findOne({ where: { userId: message.author.id } });

        if (!fagBucks) {
            await message.client.FagBucks.create({
                userId: message.author.id,
                amount: 100
            });

            fagBucks = await message.client.FagBucks.findOne({ where: { userId: message.author.id } });
        }

        await fagBucks.update({ amount: fagBucks.amount + 100 });
        return message.channel.send('You have claimed your daily allowance of **100 💵 FagBucks**!');
    }
}

module.exports = {
    DailyCommand
};
