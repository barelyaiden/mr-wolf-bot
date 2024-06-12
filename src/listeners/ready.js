const { Listener } = require('@sapphire/framework');

class ReadyListener extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            once: true,
            event: 'ready'
        });
    }

    async run(client) {
        await client.MutedMembers.sync();
        await client.TimeZones.sync();
        await client.FagBucks.sync();
        await client.DeadMembers.sync();
        const { username, id } = client.user;
        this.container.logger.info(`Successfully logged in as ${username} (${id})!`);
    }
}

module.exports = {
    ReadyListener
};
