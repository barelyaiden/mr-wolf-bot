const { Command } = require('@sapphire/framework');
const { Time } = require('@sapphire/time-utilities');
const random = require('random');
const { sendUsageEmbed } = require('../../utilities/commonMessages');
const { fetchEconomyData } = require('../../utilities/economyFunctions');

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
            cooldownDelay: Time.Minute * 30
        });
    }

    async messageRun(message, args) {
        const member = await args.pick('member').catch(() => null);
        if (!member) {
            await this.container.stores.get('preconditions').get('Cooldown').buckets.delete(this);
            return sendUsageEmbed(this, args, message);
        }

        if (member.user.id === message.client.user.id) {
            const responses = [
                'If you steal my money you basically lose yours pal.',
                'Okay but it\'s gonna come out of your own pockets.',
                `!steal ${message.author}`,
                'Nuh uh!',
                'Can\'t steal from me! ¯\_(ツ)_/¯',
                'in the stripped club. straight up "jorking it". and by "it", haha, well. let\'s justr say. My peanits'
            ];
            await this.container.stores.get('preconditions').get('Cooldown').buckets.delete(this);
            return message.channel.send(responses[random.int(0, responses.length - 1)]);
        } else if (member.user.bot) {
            const responses = [
                'Okay well that\'s just mean if you wanna steal from an innocent little bot 🥺',
                'I don\'t even care enough to answer back.',
                'They don\'t even have money!',
                'Hm, let me pull up their balance. Oh! It seems as if THEY DON\'T HAVE A BANK ACCOUNT HERE LIKE I SAID BEFORE COUNTLESS TIMES.',
                'Can\'t steal from bots either! ¯\_(ツ)_/¯',
                'KILL YOURSELF'
            ];
            await this.container.stores.get('preconditions').get('Cooldown').buckets.delete(this);
            return message.channel.send(responses[random.int(0, responses.length - 1)]);
        } else if (member.user.id === message.author.id) {
            const responses = [
                'How would you even steal from yourself? That\'s stupid.',
                'Hey pal, did you blow in from stupid town?',
                'I\'m, SpongeBob! <:imspongebob:1227894473896366172>',
                'My complicated algorithms have decided that you cannot steal from yourself. Stupid.',
                'You unsuccessfully stole from yourself! Cause you can\'t. Dumbass.',
                'Can you stop trying this already?'
            ];
            await this.container.stores.get('preconditions').get('Cooldown').buckets.delete(this);
            return message.channel.send(responses[random.int(0, responses.length - 1)]);
        }

        const { count, rows } = await message.client.Moneys.findAndCountAll({ order: [['amount', 'DESC']] });

        if (count > 0) {
            if (message.author.id === rows[0].userId) {
                await this.container.stores.get('preconditions').get('Cooldown').buckets.delete(this);
                return message.channel.send('You\'re already at the top. YOU WON CAPITALISM. **WHAT ELSE DO YOU WANT.**');
            }
        }

        const selfMoneys = await fetchEconomyData(message, message.author.id);
        const Moneys = await fetchEconomyData(message, member.user.id);

        if (Moneys.amount < 500) {
            await this.container.stores.get('preconditions').get('Cooldown').buckets.delete(this);
            return message.channel.send(`${member.user.username} does not have enough **💵 Moneys** for you to steal!`);
        }

        const randomChance = random.int(0, 100);

        if (randomChance === 1) {
            const half = Moneys.amount - (Math.round(Moneys.amount / 2));
            await Moneys.update({ amount: Moneys.amount - half });
            await selfMoneys.update({ amount: selfMoneys.amount + half });
            return message.channel.send(`You tried pickpocketing ${member.user.username} and STOLE HALF OF THEIR MONEY! **${half.toLocaleString('en-US')} 💵 Moneys**!`);
        } else if (randomChance <= 25) {
            await Moneys.update({ amount: Moneys.amount - 250 });
            await selfMoneys.update({ amount: selfMoneys.amount + 250 });
            return message.channel.send(`You tried pickpocketing ${member.user.username} and stole **250 💵 Moneys**!`);
        } else if (randomChance <= 50) {
            await Moneys.update({ amount: Moneys.amount - 100 });
            await selfMoneys.update({ amount: selfMoneys.amount + 100 });
            return message.channel.send(`You tried pickpocketing ${member.user.username} and stole **100 💵 Moneys**!`);
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
