const { Precondition } = require('@sapphire/framework');
const { owners } = require('../../config.json');

class OwnerOnlyPrecondition extends Precondition {
    async messageRun(message) {
        return this.checkOwner(message.author.id);
    }

    async checkOwner(userId) {
        return owners.includes(userId)
            ? this.ok()
            : this.error({
                message: 'Only the bot owner can use this command.',
                context: { silent: true }
            });
    }
}

module.exports = {
    OwnerOnlyPrecondition
};
