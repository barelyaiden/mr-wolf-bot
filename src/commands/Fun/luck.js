const { Command } = require('@sapphire/framework');
const { Time } = require('@sapphire/time-utilities');
const random = require('random');

class LuckCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'luck',
            description: 'Try your luck and see if you win a prize!',
            cooldownDelay: Time.Hour
        });
    }

    async messageRun(message) {
        const randomChance = random.int(0, 100);

        let fagBucks = await message.client.FagBucks.findOne({ where: { userId: message.author.id } });

        if (!fagBucks) {
            await message.client.FagBucks.create({
                userId: message.author.id,
                amount: 100
            });

            fagBucks = await message.client.FagBucks.findOne({ where: { userId: message.author.id } });
        }

        if (randomChance <= 1) {
            await fagBucks.update({ amount: fagBucks.amount + 1000 });
            return message.channel.send('Congratulations! You won **1000 💵 FagBucks**!');
        } else if (randomChance <= 10) {
            await fagBucks.update({ amount: fagBucks.amount + 500 });
            return message.channel.send('Congratulations! You won **500 💵 FagBucks**!');
        } else if (randomChance <= 25) {
            await fagBucks.update({ amount: fagBucks.amount + 250 });
            return message.channel.send('Congratulations! You won **250 💵 FagBucks**!');
        } else {
            return message.channel.send('Ah, failed! Better luck next time!');
        }
    }
}

module.exports = {
    LuckCommand
};
