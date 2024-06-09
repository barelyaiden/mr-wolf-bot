const { Command } = require('@sapphire/framework');
const { Time } = require('@sapphire/time-utilities');
const random = require('random');

class SecondChanceCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'secondchance',
            aliases: ['sc'],
            description: 'Get a second chance at developing a gambling addiction!',
            cooldownDelay: Time.Day
        });
    }

    async messageRun(message) {
        const randomChance = random.int(0, 100);
        let loan = 100;
        if (randomChance <= 5) loan = 500;

        let fagBucks = await message.client.FagBucks.findOne({ where: { userId: message.author.id } });

        if (!fagBucks) {
            await message.client.FagBucks.create({
                userId: message.author.id,
                amount: 100
            });

            await this.container.stores.get('preconditions').get('Cooldown').buckets.delete(this);
            return message.channel.send(`You have received your starting amount of **100 💵 FagBucks** since you're new!\nNo second chance needed... for now...`);
        }

        if (fagBucks.amount !== 0) {
            await this.container.stores.get('preconditions').get('Cooldown').buckets.delete(this);
            return message.channel.send(`You already have **${fagBucks.amount} 💵 FagBucks**!`);
        }

        await fagBucks.update({ amount: loan });
        return message.channel.send(`You have been given a second chance... at gambling!\n**You have received ${loan} 💵 FagBucks!**`);
    }
}

module.exports = {
    SecondChanceCommand
};
