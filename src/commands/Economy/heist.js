const { Command } = require('@sapphire/framework');
const { Time } = require('@sapphire/time-utilities');
const random = require('random');
const commonMessages = require('../../utilities/commonMessages');

class HeistCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'heist',
            description: 'Start a heist and steal from someone\'s bank account! If you get through the security measures anyway.',
            detailedDescription: {
                usage: '[member]',
                example: '@tannaers'
            },
            cooldownDelay: Time.Hour * 3
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
                'I don\'t even have a bank account!',
                'I control all the bank accounts so...',
                `!heist ${message.author}`,
                'Nope!',
                'Can\'t steal from my bank account! ¯\_(ツ)_/¯',
                'in the party tonite. straight up "chilling". and by "chilling", haha, well. let\'s justr say. Like a cool guy'
            ];
            return message.channel.send(responses[random.int(0, responses.length - 1)]);
        } else if (member.user.bot) {
            await this.container.stores.get('preconditions').get('Cooldown').buckets.delete(this);
            const responses = [
                'Bots can\'t even have bank accounts!',
                'Sorry I don\'t let the other loser bots in this exclusive bank club.',
                'Pfft I\'m too cool for them to owe ME money.',
                'idk man can you just please stop that ffs',
                'In an alternate reality... where everything is the same... you still failed.',
                'KEEP YOURSELF SAFE'
            ];
            return message.channel.send(responses[random.int(0, responses.length - 1)]);
        } else if (member.user.id === message.author.id) {
            await this.container.stores.get('preconditions').get('Cooldown').buckets.delete(this);
            const responses = [
                'Well if you steal from your own bank account you\'ll just get it locked up.',
                'Oh wait it won\'t get locked up you\'ll just deposit money from it like normal.',
                'CHAT LAUGH AT THIS USER TRYING TO STEAL FROM THEIR OWN BANK ACCOUNT!',
                'Unfortunately I don\'t run on ChatGPT so I can\'t be stupid and let you do that.',
                'You had an unsuccessful heist! Cause you tried stealing from yourself! Idiot.',
                'When are you gonna give it up?'
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

        if (fagBucks.bank < 5000) {
            await this.container.stores.get('preconditions').get('Cooldown').buckets.delete(this);
            return message.channel.send(`${member.user.username} does not have enough **💵 FagBucks** stored away for you to steal!`);
        }

        const randomChance = random.int(0, 100);

        if (randomChance === 1) {
            const half = fagBucks.bank - (Math.round(fagBucks.bank / 2));
            await fagBucks.update({ bank: fagBucks.bank - half });
            await selfFagBucks.update({ amount: selfFagBucks.amount + half });
            return message.channel.send(`You started a heist on ${member.user.username}${(member.user.username.endsWith('s')) ? '\'' : '\'s'} bank account and STOLE HALF THEIR SAVED UP MONEY! **${half.toLocaleString('en-US')} 💵 FagBucks**!`);
        } else if (randomChance <= 15) {
            await fagBucks.update({ bank: fagBucks.bank - 1000 });
            await selfFagBucks.update({ amount: selfFagBucks.amount + 1000 });
            return message.channel.send(`You started a heist on ${member.user.username}${(member.user.username.endsWith('s')) ? '\'' : '\'s'} bank account and stole **1,000 💵 FagBucks**!`);
        } else if (randomChance <= 30) {
            await fagBucks.update({ bank: fagBucks.bank - 500 });
            await selfFagBucks.update({ amount: selfFagBucks.amount + 500 });
            return message.channel.send(`You started a heist on ${member.user.username}${(member.user.username.endsWith('s')) ? '\'' : '\'s'} bank account and stole **500 💵 FagBucks**!`);
        } else {
            const responses = [
                `You started a heist on ${member.user.username}${(member.user.username.endsWith('s')) ? '\'' : '\'s'} bank account but you couldn\'t get past the captcha.`,
                `${member.user.username} has 2FA on! FUCK!`,
                `You tried logging in to ${member.user.username}${(member.user.username.endsWith('s')) ? '\'' : '\'s'} bank account but you got stopped after 4 attempts.`,
                `You decided you have better things to do and left ${member.user.username} alone.`,
                `Apparently this whole time ${member.user.username} was standing right behind you and saw everything. You gave up out of embarrassment.`,
                `Oh! Your phone grew wings and flew away! Maybe you should\'ve kept the Red Bull better hidden.`
            ];
            return message.channel.send(responses[random.int(0, responses.length - 1)]);
        }
    }
}

module.exports = {
    HeistCommand
};
