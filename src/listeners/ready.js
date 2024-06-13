const { Listener } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');
const { guildId, channels } = require('../../config.json');

class ReadyListener extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            once: true,
            event: 'ready'
        });
    }

    async run(client) {
        const finalTimestamp = new Date();

        await client.MutedMembers.sync();
        await client.TimeZones.sync();
        await client.FagBucks.sync();
        await client.DeadMembers.sync();

        const { username, id } = client.user;
        this.container.logger.info(`Successfully logged in as ${username} (${id})!`);

        const guild = await client.guilds.fetch(guildId);
        const logsChannel = await guild.channels.cache.find(ch => ch.name === channels.logsChannel);
        
        const logEmbed = new EmbedBuilder()
            .setColor(0xfbfbfb)
            .setAuthor({ name: `I am now online!`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .addFields(
                { name: 'Startup Time:', value: `\`${finalTimestamp.getTime() - client.initialTimestamp.getTime()}ms\`` }
            )
            .setTimestamp();

        await logsChannel.send({ embeds: [logEmbed] });
    }
}

module.exports = {
    ReadyListener
};
