const { Command } = require('@sapphire/framework');
const { AttachmentBuilder } = require('discord.js');
const { owners } = require('../../../config.json');
const fs = require('node:fs');

class AvatarCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'avatar',
            aliases: ['pfp'],
            description: 'Get a member\'s avatar.',
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
            if (message.author.id === owners[0]) {
                return this.getWolfAvatar(message);
            } else {
                fetchedMember = await message.author.fetch();
                if (!fetchedMember.avatarURL()) return message.reply('You don\'t have an avatar.');
                return message.reply({ content: 'Your avatar:', files: [fetchedMember.avatarURL({ extension: 'png', dynamic: true, size: 4096 })] });
            }
        }

        fetchedMember = await member.user.fetch();

        if (member.user.id === message.client.user.id) {
            return message.reply({ content: 'My avatar!', files: [fetchedMember.avatarURL({ extension: 'png', dynamic: true, size: 4096 })] });
        }

        if (member.user.id === owners[0]) return this.getWolfAvatar(message, member);
        if (!fetchedMember.avatarURL()) return message.reply('That member doesn\'t have an avatar.');

        return message.reply({ content: `${member.user.username}${(member.user.username.endsWith('s')) ? '\'' : '\'s'} avatar:`, files: [fetchedMember.avatarURL({ extension: 'png', dynamic: true, size: 4096 })] });
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
    
    async getWolfAvatar(message, member=null) {
        let wolfAvatar;
        const randomChance = Math.floor(Math.random() * 100);

        if (randomChance === 1) {
            wolfAvatar = './assets/images/secretWolf.png';
        } else {
            const wolfAvatars = this.getFiles('./assets/images/wolfAvatars');
            wolfAvatar = wolfAvatars[Math.floor(Math.random() * wolfAvatars.length)];
        }
        
        const attachment = new AttachmentBuilder(wolfAvatar);

        if (member) {
            await message.reply({ content: `${member.user.username}${(member.user.username.endsWith('s')) ? '\'' : '\'s'} avatar:`, files: [attachment] });
        } else {
            await message.reply({ content: 'Your avatar:', files: [attachment] });
        }
    }
}

module.exports = {
    AvatarCommand
};