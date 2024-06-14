// secondchance.js doesn't use this function and has custom functionality applied to it, make sure to also edit that with this.
async function fetchEconomyData(message, userId) {
    let Moneys = await message.client.Moneys.findOne({ where: { userId: userId } });

    if (!Moneys) {
        await message.client.Moneys.create({
            userId: userId,
            amount: 100,
            bank: 0
        });

        Moneys = await message.client.Moneys.findOne({ where: { userId: userId } });
    }

    return Moneys;
}

module.exports = { fetchEconomyData };
