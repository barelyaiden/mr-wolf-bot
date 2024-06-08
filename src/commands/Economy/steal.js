const { Command } = require('@sapphire/framework');
const { Time } = require('@sapphire/time-utilities');
const commonMessages = require('../../utilities/commonMessages');

class StealCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'steal',
            aliases: ['rob'],
            description: 'Steal someone else\'s money! If you succeed anyway.',
            detailedDescription: {
                usage: '[member]',
                example: '@thepoopwitch'
            },
            cooldownDelay: Time.Minute * 10
        });
    }

    async messageRun(message, args) {
        const member = await args.pick('member').catch(() => null);
        if (!member) {
            await this.container.stores.get('preconditions').get('Cooldown').buckets.delete(this);
            return commonMessages.sendUsageEmbed(this, message, args);
        }

        if (member.user.id === message.client.user.id) {
            await this.container.stores.get('preconditions').get('Cooldown').buckets.delete(this);
            return message.channel.send('If you steal my money you basically lose yours pal.');
        } else if (member.user.bot) {
            await this.container.stores.get('preconditions').get('Cooldown').buckets.delete(this);
            return message.channel.send('Okay well that\'s just mean if you wanna steal from an innocent little bot 🥺');
        } else if (member.user.id === message.author.id) {
            await this.container.stores.get('preconditions').get('Cooldown').buckets.delete(this);
            return message.channel.send('How would you even steal from yourself? Go buy ice cream? That\'s stupid.');
        }

        const selfFagBucks = await message.client.FagBucks.findOne({ where: { userId: message.author.id } });

        if (!selfFagBucks) {
            await message.client.FagBucks.create({
                userId: message.author.id,
                amount: 100
            });

            // return message.channel.send('You\'re not even in debt! You just received your complementary **100 💵 FagBucks** cause you\'re new! Now SKIDDADDLE!!!');
        }

        // if (selfFagBucks.amount > 50) return message.channel.send(`You still have **${selfFagBucks.amount} 💵 FagBucks**. Come back when you\'re ACTUALLY broke.`);

        let fagBucks = await message.client.FagBucks.findOne({ where: { userId: member.user.id } });

        if (!fagBucks) {
            await message.client.FagBucks.create({
                userId: message.author.id,
                amount: 100
            });

            fagBucks = await message.client.FagBucks.findOne({ where: { userId: member.user.id } });
        }

        if (fagBucks.amount < 250) {
            await this.container.stores.get('preconditions').get('Cooldown').buckets.delete(this);
            return message.channel.send(`${member.user.username} does not have enough **💵 FagBucks** for you to steal!`);
        }

        const randomChance = Math.random() * 100;

        if (randomChance <= 1) {
            const allOfIt = fagBucks.amount;
            await fagBucks.update({ amount: fagBucks.amount - allOfIt });
            await selfFagBucks.update({ amount: selfFagBucks.amount + allOfIt });
            return message.channel.send(`You tried pickpocketing ${member.user.username} and STOLE ALL OF THEIR MONEY! **${allOfIt} 💵 FagBucks**!`);
        } else if (randomChance <= 15) {
            await fagBucks.update({ amount: fagBucks.amount - 250 });
            await selfFagBucks.update({ amount: selfFagBucks.amount + 250 });
            return message.channel.send(`You tried pickpocketing ${member.user.username} and gained **250 💵 FagBucks**!`);
        } else if (randomChance <= 25) {
            await fagBucks.update({ amount: fagBucks.amount - 100 });
            await selfFagBucks.update({ amount: selfFagBucks.amount + 100 });
            return message.channel.send(`You tried pickpocketing ${member.user.username} and gained **100 💵 FagBucks**!`);
        } else {
            return message.channel.send(`You tried pickpocketing ${member.user.username} but failed! Now they're looking at you with a thousand yard stare.`);
        }
    }
}

module.exports = {
    StealCommand
};
