const { Command } = require('@sapphire/framework');

class BalanceCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'balance',
            aliases: ['bal'],
            description: 'Check your balance!',
            detailedDescription: {
                usage: '(member)',
                example: '@barelyaiden'
            }
        });
    }

    async messageRun(message, args) {
        const member = await args.pick('member').catch(() => null);

        if (member && member.user.id === message.client.user.id) {
            return message.channel.send('Oh I\'m the OWNER of this operation ALL of the server\'s money is mine sucker!!!');
        } else if (member && member.user.bot) {
            return message.channel.send('I\'m sure bots have more important things to do than gamble away all their revenue 💀');
        }

        if (!member || member.user.id === message.author.id) {
            let fagBucks = await message.client.FagBucks.findOne({ where: { userId: message.author.id } });

            if (!fagBucks) {
                await message.client.FagBucks.create({
                    userId: message.author.id,
                    amount: 100
                });
    
                fagBucks = await message.client.FagBucks.findOne({ where: { userId: message.author.id } });
            }

            return message.channel.send(`You have **${fagBucks.amount} 💵 FagBucks**!`);
        } else {
            let fagBucks = await message.client.FagBucks.findOne({ where: { userId: member.user.id } });

            if (!fagBucks) {
                await message.client.FagBucks.create({
                    userId: member.user.id,
                    amount: 100
                });
    
                fagBucks = await message.client.FagBucks.findOne({ where: { userId: member.user.id } });
            }

            return message.channel.send(`${member.user.username} has **${fagBucks.amount} 💵 FagBucks**!`);
        }
    }
}

module.exports = {
    BalanceCommand
};
