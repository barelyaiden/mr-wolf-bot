const { Command } = require('@sapphire/framework');
const { owners, users } = require('../../../config.json');

class KyleCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'kyle',
            description: 'A secret command for Kyle!',
            preconditions: ['KyleOnly']
        });
    }

    async messageRun(message) {
        await message.delete();
        
        const aiden = await message.client.users.fetch(owners[0]);
        const kyle = await message.client.users.fetch(users.kyle);

        await aiden.createDM();
        await kyle.createDM();

        try {
            await kyle.send('A telepathic connection was made...');
            return aiden.send('Kyle requires your love!');
        } catch {
            return this.container.logger.info('An error occured trying to execute Kyle\'s command.');
        }
    }
}

module.exports = {
    KyleCommand
};