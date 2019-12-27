const Discord = require('discord.js')
const Enmap = require('enmap')
const { promisify } = require('util')
const readdir = promisify(require('fs').readdir)

const client = new Discord.Client()

client.config = require('./config.js')

require('./modules/functions.js')(client)

client.commands = new Enmap()
client.aliases = new Enmap()

// The init script - prepares it all for starting
const init = async () => {
  // Searches for all commands & loads them
  const cmdFiles = await readdir('./commands/')
  console.log(`Loading a total of ${cmdFiles.length} commands.`)
  cmdFiles.forEach(f => {
    if (!f.endsWith('.js')) return
    const response = client.loadCommand(f)
    if (response) console.log(response)
  })
  // Searches for all events & loads them
  const evtFiles = await readdir('./events/')
  console.log(` Loading a total of ${evtFiles.length} events.`)
  evtFiles.forEach(file => {
    const eventName = file.split('.')[0]
    console.log(`Loading Event: ${eventName}`)
    const event = require(`./events/${file}`)

    client.on(eventName, event.bind(null, client))
  })

  // Builds the level Cache (the two levels used lol)
  client.levelCache = {}
  for (let i = 0; i < client.config.permLevels.length; i++) {
    const thisLevel = client.config.permLevels[i]
    client.levelCache[thisLevel.level] = thisLevel.level
  }

  client.login(client.config.token)
}

init()