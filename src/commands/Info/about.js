const { Command } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');
const { version, description, author, dependencies } = require('../../../package.json');
const moment = require('moment');
require('moment-duration-format');

class AboutCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'about',
            aliases: ['info'],
            description: 'Get information about the bot.'
        });
    }

    async messageRun(message) {
        const aboutEmbed = new EmbedBuilder()
            .setColor(0xfbfbfb)
            .setAuthor({ name: 'About Mr. Wolf Bot', iconURL: message.client.user.displayAvatarURL({ extension: 'png', dynamic: true })})
            .setDescription(description)
            .addFields(
                { name: 'Author:', value: author, inline: true },
                { name: 'Version:', value: version, inline: true },
                { name: 'Library:', value: `discord.js${dependencies['discord.js']}`, inline: true }
            )
            .setFooter({ text: `Coded with ❤️ Uptime: ${moment.duration(message.client.uptime).format('D [days] H [hours] m [mins] s [secs]')}` })
            .setTimestamp();

        return message.reply({ embeds: [aboutEmbed] });
    }
}

module.exports = {
    AboutCommand
};