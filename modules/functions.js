module.exports = (client) => {
    // Command Loader
    client.loadCommand = (commandName) => {
      try {
        console.log(`Loading Command: ${commandName}`)
        const props = require(`../commands/${commandName}`)
        if (props.init) {
          props.init(client)
        }
        client.commands.set(props.help.name, props)
        props.conf.aliases.forEach(alias => {
          client.aliases.set(alias, props.help.name)
        })
        return false
      } catch (e) {
        return `Unable to load command ${commandName}: ${e}`
      }
    }
    // Clean text of various characters
  
    client.clean = async (client, text) => {
      if (text && text.constructor.name === 'Promise') {
        text = await text
      }
      if (typeof (text) !== 'string') {
        text = require('util').inspect(text, {
          depth: 0
        })
      }
      if (typeof (text) === 'string') {
        text = text
          .replace(/`/g, '`' + String.fromCharCode(8203))
          .replace(/@/g, '@' + String.fromCharCode(8203))
          .replace(client.token, 'TOKEN')
      }
      return text
    }
  
    // Level Checker
    client.permlevel = message => {
      let permlvl = 0
      const permOrder = client.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1)
      while (permOrder.length) {
        const currentLevel = permOrder.shift()
        if (message.guild && currentLevel.guildOnly) continue
        if (currentLevel.check(message)) {
          permlvl = currentLevel.level
          break
        }
      }
      return permlvl
    }
  }