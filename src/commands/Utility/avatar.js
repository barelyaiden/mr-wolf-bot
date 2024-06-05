const { Command } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');
const { owners } = require('../../../config.json');
const fs = require('node:fs');

class AvatarCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'avatar',
            aliases: ['pfp', 'gavatar', 'gpfp'],
            description: 'Get a member\'s avatar.',
            detailedDescription: {
                usage: '(member)',
                example: '@barelyaiden'
            }
        });
    }

    async messageRun(message, args) {
        const member = await args.pick('member').catch(() => null);
        let msg, avatar;
        let isAiden = false;

        if (!member || member.user.id === message.author.id) {
            if (!message.member.displayAvatarURL()) return message.channel.send('You don\'t have an avatar.');
            msg = 'Your Avatar:';
            avatar = message.member.displayAvatarURL({ extension: 'png', dynamic: true, size: 1024 });
            if (args.commandContext.commandName.startsWith('g')) avatar = message.author.displayAvatarURL({ extension: 'png', dynamic: true, size: 1024 });
            if (!member && message.author.id === owners[0] || member && member.user.id === owners[0]) isAiden = true;
        } else {
            if (!member.displayAvatarURL()) return message.channel.send('That member does not have an avatar.');
            msg = `${member.user.username}${(member.user.username.endsWith('s')) ? '\'' : '\'s'} Avatar:`;
            avatar = member.displayAvatarURL({ extension: 'png', dynamic: true, size: 1024 });
            if (member.user.id === message.client.user.id) msg = 'My Avatar:';
            if (args.commandContext.commandName.startsWith('g')) avatar = member.user.avatarURL({ extension: 'png', dynamic: true, size: 1024 });
            if (member.user.id === owners[0]) isAiden = true;
        }

        const avatarEmbed = new EmbedBuilder()
            .setColor(0xfbfbfb)
            .setAuthor({ name: msg, iconURL: avatar })
            .setImage(avatar)
            .setTimestamp();

        if (isAiden) {
            const wolfAvatar = await this.getWolfAvatar();
            const attachmentName = `attachment://${wolfAvatar.substring(wolfAvatar.lastIndexOf('/') + 1)}`;
            avatarEmbed.setAuthor({ name: msg, iconURL: attachmentName });
            avatarEmbed.setImage(attachmentName);
            return message.channel.send({ embeds: [avatarEmbed], files: [wolfAvatar] });
        }
        
        return message.channel.send({ embeds: [avatarEmbed] });
    }

    getFiles(dir, files = []) {
        const fileList = fs.readdirSync(dir);
        
        for (const file of fileList) {
            const name = `${dir}/${file}`;
    
            if (fs.statSync(name).isDirectory()) {
                this.getFiles(name, files);
            } else {
                files.push(name);
            }
        }
    
        return files;
    }
    
    async getWolfAvatar() {
        let wolfAvatar;
        const randomChance = Math.floor(Math.random() * 100);

        if (randomChance === 1) {
            wolfAvatar = './assets/images/secretWolf.png';
        } else {
            const wolfAvatars = this.getFiles('./assets/images/wolfAvatars');
            wolfAvatar = wolfAvatars[Math.floor(Math.random() * wolfAvatars.length)];
        }
        
        return wolfAvatar;
    }
}

module.exports = {
    AvatarCommand
};
