const { Command } = require('@sapphire/framework');
const { PermissionsBitField } = require('discord.js');
const { users, roles } = require('../../../config.json');

class ReviveCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'revive',
            description: 'Mods, revive that guy! :)',
            detailedDescription: {
                usage: '[member]',
                example: '@zman4302'
            },
            requiredUserPermissions: [PermissionsBitField.Flags.KickMembers],
            requiredClientPermissions: [PermissionsBitField.Flags.KickMembers]
        });
    }

    async messageRun(message, args) {
        const member = await args.pick('member').catch(() => null);
        
        if (!member) return message.reply(`Usage: \`${this.container.client.options.defaultPrefix}${this.name} ${this.detailedDescription.usage}\``);
        if (member.id === message.author.id) return message.reply('I don\'t think you can revive yourself if you\'re dead in the first place?');
        if (member.id === message.client.user.id) return message.reply('I said I\'m **immortal**');
        if (member.roles.cache.some(role => role.name === roles.moderatorRole)) return message.reply('Friendly fire is not allowed in the first place!!!');

        const deadPerson = await message.client.DeadUsernames.findOne({ where: { userId: member.user.id } });

        if (deadPerson) {
            const originalName = deadPerson.get('name');

            if (originalName === member.user.globalName) {
                await member.setNickname('');
            } else {
                await member.setNickname(deadPerson.get('name'));
            }
            
            await message.client.DeadUsernames.destroy({ where: { userId: member.user.id } });
            if (member.user.id === users.yapixx) return message.reply({ content: `Successfully revived ${member}!`, files: ['./assets/images/specialRevive.gif'] });
            return message.reply({ content: `Successfully revived ${member}!`, files: ['./assets/images/revive.gif'] });
        }

        if (member.nickname.startsWith('[DEAD]')) return message.reply('# ⚠️ ALERT ALERT ALERT ⚠️\n# ⚠️ THEY\'RE PRETENDING TO BE DEAD! ⚠️\n# ⚠️ GET THAT MOTHERFUCKER! ⚠️');
        return message.reply('That person is not dead!');
    }
}

module.exports = {
    ReviveCommand
};