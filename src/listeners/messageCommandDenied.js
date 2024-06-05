const { Listener, Identifiers } = require('@sapphire/framework');

class MessageCommandDenied extends Listener {
    run(error, { message }) {
        if (error.context.silent || error.identifier === Identifiers.PreconditionUserPermissions) return;
        return message.channel.send(`${error.message}`);
    }
}

module.exports = {
    MessageCommandDenied
};
