exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    const code = args.join(' ')
    if (code.includes('client.token')) {
      return message.channel.send('No thanks.')
    }
    try {
      const evaled = eval(code)
      const clean = await client.clean(client, evaled)
      if (clean.length > 2040) {
        message.channel.send('The evaled code is too large! Check the console!') // We need to add a splitter sometime.
      } else {
        message.channel.send({
          embed: {
            color: message.guild.members.get(client.user.id).displayColor,
            title: "Here's your evaled code!",
            description: `\`\`\`js\n${clean}\n\`\`\``
          }
        })
      }
      console.log(`Eval results: ${clean}`);
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${await client.clean(client, err)}\n\`\`\``)
    }
  }
  
  exports.conf = {
    aliases: ['e', 'evaluate'],
    permLevel: 10
  }
  
  exports.help = {
    name: 'eval',
    category: 'System',
    description: 'Evaluates arbitrary javascript.',
    usage: 'eval [...code]',
    example: 'eval message.reply(\'No\')'
  }