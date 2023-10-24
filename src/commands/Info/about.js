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
            .setAuthor({ name: 'About Mr. Wolf Bot', iconURL: message.client.user.displayAvatarURL({ dynamic: true })})
            .setDescription(description)
            .addFields(
                { name: 'Author:', value: author },
                { name: 'Version:', value: version },
                { name: 'Library:', value: `discord.js ${dependencies['discord.js'].substring(1)}` },
                { name: 'Runtime:', value: `Node.js ${process.version.substring(1)}` }
            )
            .setFooter({ text: `Uptime: ${moment.duration(message.client.uptime).format('h:mm:ss', { trim: false })}` })
            .setTimestamp();

        return message.channel.send({ embeds: [aboutEmbed] });
    }
}

module.exports = {
    AboutCommand
};