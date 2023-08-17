const { Command } = require('@sapphire/framework');

class BannerCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'banner',
            aliases: ['header'],
            description: 'Get a member\'s banner.',
            detailedDescription: {
                usage: '(member)',
                example: '@barelyaiden'
            }
        });
    }

    async messageRun(message, args) {
        const member = await args.pick('member').catch(() => null);
        let fetchedMember;

        if (!member || member.user.id === message.author.id) {
            fetchedMember = await message.author.fetch();
            if (!fetchedMember.bannerURL()) return message.reply('You don\'t have a banner.');
            return message.reply({ content: 'Your banner:', files: [fetchedMember.bannerURL({ extension: 'png', dynamic: true, size: 4096 })] });
        }

        fetchedMember = await member.user.fetch();

        if (member.user.id === message.client.user.id) return message.reply('I don\'t have a banner!');
        if (!fetchedMember.bannerURL()) return message.reply('That member doesn\'t have a banner.');
        return message.reply({ content: `${member.user.username}${(member.user.username.endsWith('s')) ? '\'' : '\'s'} banner:`, files: [fetchedMember.bannerURL({ extension: 'png', dynamic: true, size: 4096 })] });
    }
}

module.exports = {
    BannerCommand
};