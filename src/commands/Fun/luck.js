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

        let selfFagBucks = await message.client.FagBucks.findOne({ where: { userId: message.author.id } });

        if (!selfFagBucks) {
            await message.client.FagBucks.create({
                userId: message.author.id,
                amount: 100,
                bank: 0
            });

            selfFagBucks = await message.client.FagBucks.findOne({ where: { userId: message.author.id } });
        }

        if (randomChance === 1) {
            await selfFagBucks.update({ amount: selfFagBucks.amount + 1000 });
            return message.channel.send('Congratulations! You won **1,000 💵 FagBucks**!');
        } else if (randomChance <= 10) {
            await selfFagBucks.update({ amount: selfFagBucks.amount + 500 });
            return message.channel.send('Congratulations! You won **500 💵 FagBucks**!');
        } else if (randomChance <= 25) {
            await selfFagBucks.update({ amount: selfFagBucks.amount + 250 });
            return message.channel.send('Congratulations! You won **250 💵 FagBucks**!');
        } else {
            const responses = [
                'Out of luck! The odds were against you.',
                'Miss! The universe said no.',
                '**[🎱]** My sources say no.',
                'Fail! Better luck next time.',
                'it no work 💀',
                'Nope! Maybe it\'ll work next time.'
            ];
            return message.channel.send(responses[random.int(0, responses.length - 1)]);
        }
    }
}

module.exports = {
    LuckCommand
};
