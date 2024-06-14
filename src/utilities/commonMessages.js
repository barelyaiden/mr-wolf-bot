const { EmbedBuilder } = require('discord.js');

const embedColor = 0xfbfbfb;

function createBasicEmbed(name, user) {
    const basicEmbed = new EmbedBuilder()
        .setColor(embedColor)
        .setAuthor({ name: `${name}`, iconURL: user.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();

    return basicEmbed;
}

async function sendUsageEmbed(context, args, message) {
    const prefix = context.container.client.options.defaultPrefix;
    const command = context.container.stores.get('commands').get(args.commandContext.commandName);

    const usageEmbed = new EmbedBuilder()
        .setColor(embedColor)
        .setAuthor({ name: `Command: ${prefix}${command.name}`, iconURL: message.client.user.displayAvatarURL({ dynamic: true }) })
        .addFields(
            { name: 'Usage:', value: `\`\`\`${prefix}${command.name} ${command.detailedDescription.usage}\`\`\`` },
            { name: 'Example:', value: `\`\`\`${prefix}${command.name} ${command.detailedDescription.example}\`\`\`` }
        )
        .setTimestamp();

    await message.channel.send({ embeds: [usageEmbed] });
}

module.exports = { embedColor, createBasicEmbed, sendUsageEmbed };
