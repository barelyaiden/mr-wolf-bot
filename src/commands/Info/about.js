const { Command } = require('@sapphire/framework');
const moment = require('moment');
require('moment-duration-format');
const { createBasicEmbed } = require('../../utilities/commonMessages');
const { version, description, author, dependencies } = require('../../../package.json');

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
        const aboutEmbed = createBasicEmbed('About Mr. Wolf Bot', message.client.user);
        aboutEmbed.setDescription(description);
        aboutEmbed.addFields(
            { name: 'Author:', value: author },
            { name: 'Version:', value: version },
            { name: 'Library:', value: `discord.js ${dependencies['discord.js'].substring(1)}` },
            { name: 'Runtime:', value: `Node.js ${process.version.substring(1)}` }
        );
        aboutEmbed.setFooter({ text: `Uptime: ${moment.duration(message.client.uptime).format('h:mm:ss', { trim: false })}` });
        return message.channel.send({ embeds: [aboutEmbed] });
    }
}

module.exports = {
    AboutCommand
};
