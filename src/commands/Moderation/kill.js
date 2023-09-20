const { Command } = require('@sapphire/framework');
const { PermissionsBitField } = require('discord.js');
const { users, roles } = require('../../../config.json');

class KillCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'kill',
            description: 'Mods, kill that guy.',
            detailedDescription: {
                usage: '[member] (reason)',
                example: '@zman4302 Why not!'
            },
            requiredUserPermissions: [PermissionsBitField.Flags.KickMembers],
            requiredClientPermissions: [PermissionsBitField.Flags.KickMembers]
        });
    }

    async messageRun(message, args) {
        const member = await args.pick('member').catch(() => null);
        const reason = args.finished ? 'no reason ¯\\_(ツ)_/¯' : await args.rest('string');
        
        if (!member) return message.reply(`Usage: \`${this.container.client.options.defaultPrefix}${this.name} ${this.detailedDescription.usage}\``);
        if (member.id === message.author.id) return message.reply('Now why would you do that...');
        if (member.id === message.client.user.id) return message.reply('Have fun fighting against my immortality <:trolle:961244900593115206>');
        if (member.roles.cache.some(role => role.name === roles.moderatorRole)) return message.reply('Friendly fire isn\'t allowed!');

        const deadPerson = await message.client.DeadUsernames.findOne({ where: { userId: member.user.id } });
        if (!deadPerson && member.nickname && member.nickname.startsWith('[DEAD]')) return message.reply('# ⚠️ ALERT ALERT ALERT ⚠️\n# ⚠️ THEY\'RE PRETENDING TO BE DEAD! ⚠️\n# ⚠️ GET THAT MOTHERFUCKER! ⚠️');

        try {
            if (!member.nickname) {
                await message.client.DeadUsernames.create({
                    userId: member.user.id,
                    name: member.user.globalName
                });
                await member.setNickname(`[DEAD] ${member.user.globalName.slice(0, 24)}`);
            } else {
                await message.client.DeadUsernames.create({
                    userId: member.user.id,
                    name: member.nickname
                });
                await member.setNickname(`[DEAD] ${member.nickname.slice(0, 24)}`);
            }
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return message.reply('That member is already dead!');
            }

            return message.reply('Could not kill that member.');
        }

        if (member.user.id === users.yapixx) return message.channel.send({ content: `${message.author} has killed ${member} for ${reason}`, files: ['./assets/images/specialKill.gif'] });
        return message.channel.send({ content: `${message.author} has killed ${member} for ${reason}`, files: ['./assets/images/kill.gif'] });
    }
}

module.exports = {
    KillCommand
};