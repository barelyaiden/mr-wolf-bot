const { Command } = require('@sapphire/framework');

class SetTimeZoneCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'settimezone',
            description: 'Set your time zone for the time converter commands.',
            aliases: ['stz'],
            detailedDescription: {
                usage: '[time zone]',
                example: 'Asia/Yerevan'
            }
        });
    }

    async messageRun(message, args) {
        const timeZone = await args.pick('string').catch(() => null);
        const timeZones = Intl.supportedValuesOf('timeZone');

        if (!timeZone) {
            return message.channel.send({ content: 'To get started you can find your time zone on: <https://www.timezoneconverter.com/cgi-bin/findzone>\n**Keep in mind this is case sensitive!**', files: ['./assets/images/timeZoneExample.png'] });
        } else if (!timeZones.includes(timeZone)) {
            return message.channel.send({ content: 'That time zone is invalid!\nFind your time zone on: <https://www.timezoneconverter.com/cgi-bin/findzone>\n**Keep in mind this is case sensitive!**', files: ['./assets/images/timeZoneExample.png'] });
        }

        try {
            await message.client.TimeZones.create({
                userId: message.author.id,
                timeZone: timeZone
            });
        } catch {
            return message.channel.send('Failed to set your time zone.');
        }

        return message.channel.send(`Successfully set your time zone to: \`${timeZone}\`!`);
    }
}

module.exports = {
    SetTimeZoneCommand
};
