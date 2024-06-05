const { EmbedBuilder } = require('discord.js');

async function sendUsageEmbed(context, message, args) {
    const prefix = context.container.client.options.defaultPrefix;
    const command = context.container.stores.get('commands').get(args.commandContext.commandName);

    const usageEmbed = new EmbedBuilder()
        .setColor(0xfbfbfb)
        .setAuthor({ name: `Command: ${prefix}${command.name}`, iconURL: message.client.user.displayAvatarURL({ dynamic: true }) })
        .addFields(
            { name: 'Usage:', value: `\`\`\`${prefix}${command.name} ${command.detailedDescription.usage}\`\`\`` },
            { name: 'Example:', value: `\`\`\`${prefix}${command.name} ${command.detailedDescription.example}\`\`\`` }
        )
        .setTimestamp();

    await message.channel.send({ embeds: [usageEmbed] });
}

module.exports = { sendUsageEmbed };
