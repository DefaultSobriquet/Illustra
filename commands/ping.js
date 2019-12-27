exports.run = async (client, message) => { // eslint-disable-line no-unused-vars
    const msg = await message.channel.send('Ping!')
    msg.edit(`Pong! Latency is \`${msg.createdTimestamp - message.createdTimestamp}ms\`. API Latency is \`${Math.round(client.ping)}ms\`.`)
}
 
exports.conf = {
    aliases: [],
    permLevel: 0
}

exports.help = {
    name: 'ping',
    category: 'Miscellaneous',
    description: "It like... Pings. Then Pongs. And it's not Ping Pong.",
    usage: 'ping',
    example: 'ping'
}