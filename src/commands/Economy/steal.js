const { Command } = require('@sapphire/framework');
const { Time } = require('@sapphire/time-utilities');
const random = require('random');
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
            const responses = [
                'If you steal my money you basically lose yours pal.',
                'Okay but it\'s gonna come out of your own pockets.',
                `!steal ${message.author}`,
                'Nuh uh!',
                'Can\'t steal from me! ¯\_(ツ)_/¯',
                'in the stripped club. straight up "jorking it". and by "it", haha, well. let\'s justr say. My peanits'
            ];
            return message.channel.send(responses[random.int(0, responses.length - 1)]);
        } else if (member.user.bot) {
            await this.container.stores.get('preconditions').get('Cooldown').buckets.delete(this);
            const responses = [
                'Okay well that\'s just mean if you wanna steal from an innocent little bot 🥺',
                'I don\'t even care enough to answer back.',
                'They don\'t even have money!',
                'Hm, let me pull up their balance. Oh! It seems as if THEY DON\'T HAVE A BANK ACCOUNT HERE LIKE I SAID BEFORE COUNTLESS TIMES.',
                'Can\'t steal from bots either! ¯\_(ツ)_/¯',
                'KILL YOURSELF'
            ];
            return message.channel.send(responses[random.int(0, responses.length - 1)]);
        } else if (member.user.id === message.author.id) {
            await this.container.stores.get('preconditions').get('Cooldown').buckets.delete(this);
            const responses = [
                'How would you even steal from yourself? That\'s stupid.',
                'Hey pal, did you blow in from stupid town?',
                'I\'m, SpongeBob! <:imspongebob:1227894473896366172>',
                'My complicated algorithms have decided that you cannot steal from yourself. Stupid.',
                'You unsuccessfully stole from yourself! Cause you can\'t. Dumbass.',
                'Can you stop trying this already?'
            ];
            return message.channel.send(responses[random.int(0, responses.length - 1)]);
        }

        const { count, rows } = await message.client.FagBucks.findAndCountAll({ order: [['amount', 'DESC']] });

        if (count > 0) {
            if (message.author.id === rows[0].userId) return message.channel.send('You\'re already at the top. YOU WON CAPITALISM. **WHAT ELSE DO YOU WANT.**');
        }

        let selfFagBucks = await message.client.FagBucks.findOne({ where: { userId: message.author.id } });

        if (!selfFagBucks) {
            await message.client.FagBucks.create({
                userId: message.author.id,
                amount: 100,
                bank: 0
            });

            selfFagBucks = await message.client.FagBucks.findOne({ where: { userId: message.author.id } });
        }

        let fagBucks = await message.client.FagBucks.findOne({ where: { userId: member.user.id } });

        if (!fagBucks) {
            await message.client.FagBucks.create({
                userId: member.user.id,
                amount: 100,
                bank: 0
            });

            fagBucks = await message.client.FagBucks.findOne({ where: { userId: member.user.id } });
        }

        if (fagBucks.amount < 500) {
            await this.container.stores.get('preconditions').get('Cooldown').buckets.delete(this);
            return message.channel.send(`${member.user.username} does not have enough **💵 FagBucks** for you to steal!`);
        }

        const randomChance = random.int(0, 100);

        if (randomChance === 1) {
            const half = fagBucks.amount - (Math.round(fagBucks.amount / 2));
            await fagBucks.update({ amount: fagBucks.amount - half });
            await selfFagBucks.update({ amount: selfFagBucks.amount + half });
            return message.channel.send(`You tried pickpocketing ${member.user.username} and STOLE HALF THEIR MONEY! **${half.toLocaleString('en-US')} 💵 FagBucks**!`);
        } else if (randomChance <= 25) {
            await fagBucks.update({ amount: fagBucks.amount - 250 });
            await selfFagBucks.update({ amount: selfFagBucks.amount + 250 });
            return message.channel.send(`You tried pickpocketing ${member.user.username} and stole **250 💵 FagBucks**!`);
        } else if (randomChance <= 50) {
            await fagBucks.update({ amount: fagBucks.amount - 100 });
            await selfFagBucks.update({ amount: selfFagBucks.amount + 100 });
            return message.channel.send(`You tried pickpocketing ${member.user.username} and stole **100 💵 FagBucks**!`);
        } else {
            const responses = [
                `You tried pickpocketing ${member.user.username} but they turned around and caught you in the act!`,
                `${member.user.username} walked away before you could try.`,
                `You tried approaching ${member.user.username} but fell and cracked your skull! Shame.`,
                `You decided you wanted to be nice this time and left ${member.user.username} alone.`,
                `For some reason ${member.user.username} has bodyguards now? You got too scared and left.`,
                `You blinked and ${member.user.username} disappeared! Now you question your sanity.`
            ];
            return message.channel.send(responses[random.int(0, responses.length - 1)]);
        }
    }
}

module.exports = {
    StealCommand
};
