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
        this.container.logger.info('Initializing shutdown sequence...');
        this.container.logger.info('Sending the shutdown message...');
        const msg = await message.channel.send('**[🔌]** Shutting down...');
        this.container.logger.info('Sucessfully sent the shutdown message!');
        this.container.logger.info('Closing the database connection...');
        await message.client.sequelize.close();
        this.container.logger.info('Successfully closed the database connection!');
        this.container.logger.info('Editing the shutdown message...');
        await msg.edit('**[🔌]** I am now offline!');
        this.container.logger.info('Successfully edited the shutdown message!');
        this.container.logger.info('Shutting down...');
        return message.client.destroy();
    }
}

module.exports = {
    ShutdownCommand
};
