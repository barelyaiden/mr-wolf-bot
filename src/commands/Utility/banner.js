const { Command } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');

class BannerCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'banner',
            aliases: ['header'],
            description: 'Get a user\'s banner.',
            detailedDescription: {
                usage: '(member)',
                example: '@tannaers'
            }
        });
    }

    async messageRun(message, args) {
        const member = await args.pick('member').catch(() => null);
        let fetchedMember, msg, avatar;

        if (!member || member.user.id === message.author.id) {
            fetchedMember = await message.author.fetch();
            msg = 'Your Banner:';
            avatar = message.author.displayAvatarURL({ dynamic: true });
            if (!fetchedMember.bannerURL()) return message.channel.send('You don\'t have a banner.');
        } else {
            fetchedMember = await member.user.fetch();
            msg = `${member.user.username}${(member.user.username.endsWith('s')) ? '\'' : '\'s'} Banner:`;
            avatar = member.displayAvatarURL({ dynamic: true });
            if (member.user.id === message.client.user.id) return message.channel.send('I don\'t have a banner!');
            if (!fetchedMember.bannerURL()) return message.channel.send('That member does not have a banner.');
        }

        const bannerEmbed = new EmbedBuilder()
            .setColor(0xfbfbfb)
            .setAuthor({ name: msg, iconURL: avatar })
            .setImage(fetchedMember.bannerURL({ extension: 'png', dynamic: true, size: 1024 }))
            .setTimestamp();
        
        return message.channel.send({ embeds: [bannerEmbed] });
    }
}

module.exports = {
    BannerCommand
};
