const config = {
    token: 'NjU5MTYwMTYzMzM2MzIzMDky.XgWZLA.IKwP5KcDKBWPciHKC7MfYqNO33I', // This is the bot token.
    description: 'Illustra | A simple Discord Emote Bot', // Description of the bot
    responders: [], // User IDs for Error Logging
    sets: { // Settings
      prefix: '-'
    },
    permLevels: [ // Permissions
      {
        level: 0, // Basic level command; return true automatically so all users can run.
        check: () => true
      },
      { // For Strand Staff members
        level: 10,
        // Grabs the Strand Server object & checks if the user has the Strand Staff role.
        check: (message) => message.member.id === "600826051014426625"
      }
    ],
    status: [{ // Statuses for the bot.
      text: 'with emotes!',
      type: 'PLAYING'
    }]
  }
  
  module.exports = config