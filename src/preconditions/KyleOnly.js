const { Precondition } = require('@sapphire/framework');
const { users } = require('../../config.json');

class KyleOnlyPrecondition extends Precondition {
    async messageRun(message) {
        return this.checkIfKyle(message.author.id);
    }

    async checkIfKyle(userId) {
        return users.kyleOnly.includes(userId)
            ? this.ok()
            : this.error({
                message: 'Only Kyle can use this command.',
                context: { silent: true }
            });
    }
}

module.exports = {
    KyleOnlyPrecondition
};