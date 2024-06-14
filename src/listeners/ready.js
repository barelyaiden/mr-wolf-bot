const { Listener } = require('@sapphire/framework');
const { createBasicEmbed } = require('../utilities/commonMessages');
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
        const readyTimestamp = new Date();

        await client.MutedMembers.sync();
        await client.TimeZones.sync();
        await client.Moneys.sync();
        await client.DeadMembers.sync();

        const { username, id } = client.user;
        this.container.logger.info(`Successfully logged in as ${username} (${id})!`);

        const guild = await client.guilds.fetch(guildId);
        const logsChannel = await guild.channels.cache.find(ch => ch.name === channels.logsChannel);

        const logEmbed = createBasicEmbed('I am now online!', client.user);
        logEmbed.addFields(
            { name: 'Startup Time:', value: `\`${readyTimestamp.getTime() - client.initialTimestamp.getTime()}ms\`` }
        );

        await logsChannel.send({ embeds: [logEmbed] });
    }
}

module.exports = {
    ReadyListener
};
