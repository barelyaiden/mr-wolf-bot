const { Command } = require('@sapphire/framework');

class ShutdownCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'shutdown',
            description: 'Shut the bot down.',
            preconditions: ['OwnerOnly']
        });
    }

    async messageRun(message) {
        this.container.logger.info('Shutting down...');
        const msg = await message.channel.send('**[🔌]** Shutting down...');
        await message.client.sequelize.close();
        await msg.edit('**[🔌]** I am now offline!');
        return message.client.destroy();
    }
}

module.exports = {
    ShutdownCommand
};
