const { Command } = require('@sapphire/framework');
const { sendUsageEmbed } = require('../../utilities/commonMessages');

class TempsCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'temp',
            aliases: ['temperature', 'temps'],
            description: 'Convert temperatures between Celsius and Fahrenheit.',
            detailedDescription: {
                usage: '[temperature]',
                example: '21C'
            }
        });
    }

    async messageRun(message, args) {
        const temperature = await args.pick('string').catch(() => null);
        if (!temperature || isNaN(temperature.charAt(0)) && !/[CF]$/.test(temperature)) return sendUsageEmbed(this, args, message);

        let convertedTemperature;

        if (temperature.toLowerCase().endsWith('c')) {
            convertedTemperature = `${temperature.slice(0, -1)}°C is **${((temperature.slice(0, -1) * 9/5) + 32).toFixed(1)}°F**!`;
        } else if (temperature.toLowerCase().endsWith('f')) {
            convertedTemperature = `${temperature.slice(0, -1)}°F is **${((temperature.slice(0, -1) - 32) * 5/9).toFixed(1)}°C**!`;
        }

        return message.channel.send(`**[🌡️]** ${convertedTemperature}`);
    }
}

module.exports = {
    TempsCommand
};
