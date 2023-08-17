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
        const msg = await message.reply('Ping?');
        const content = `Pong! 🏓\nBot latency: ${Math.round(this.container.client.ws.ping)}ms.\nAPI latency: ${msg.createdTimestamp - message.createdTimestamp}ms.`;
        return msg.edit(content);
    }
}

module.exports = {
    PingCommand
};