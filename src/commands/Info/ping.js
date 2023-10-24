const { Command } = require('@sapphire/framework');

class PingCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'ping',
            aliases: ['pong'],
            description: 'Pong!'
        });
    }

    async messageRun(message) {
        const msg = await message.channel.send('Ping?');
        const content = `Pong! 🏓\nBot Latency: \`${Math.round(this.container.client.ws.ping)}ms.\`\nAPI Latency: \`${msg.createdTimestamp - message.createdTimestamp}ms.\``;
        return msg.edit(content);
    }
}

module.exports = {
    PingCommand
};