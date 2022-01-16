const Discord = require("discord.js")
require("dotenv").config()

const generateImage = require("./generateImage")



const client = new Discord.Client({
    intents: [
        "GUILDS",
        "GUILD_MESSAGES",
        "GUILD_MEMBERS"
    ]
})

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`)

    //making update local / global
    const guildID = "796845537927102495"
    const guild = client.guilds.cache.get(guildID)
    let commmands

    if (guild) {
        commands = guild.commands
    } else {
        commands = client.application.commands
    }

    //creating commands
    commands.create({
        name: 'ping',
        description: 'Replies with pong'
    })

    commands.create({
        name: 'add',
        description: 'adds two numbers togheter.',
        options: [
            {
                name: 'num1',
                description: 'The first number',
                required: true,
                type: Discord.Constants.ApplicationCommandOptionTypes.NUMBER
            },
            {
                name: 'num2',
                description: 'The second number',
                required: true,
                type: Discord.Constants.ApplicationCommandOptionTypes.NUMBER
            }
        ]
    })
})

client.on("messageCreate", (message) => {
    if (message.content == "hi") {
        message.reply("Hello World!")
    }
})

//welcome message with photo
// const generalChannelId = "796845538536456204"
const welcomeChannelId = "931028269736812554"
client.on("guildMemberAdd", async (member) => {
    const img = await generateImage(member)
    member.guild.channels.cache.get(welcomeChannelId).send({
        content: `<@${member.id}> Welcome to the server!`,
        files: [img]
    })
})

//commands
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand) {
        return
    }

    const { commandName, options } = interaction

    if (commandName === 'ping') {
        interaction.reply({
            content: 'pong',
            ephemeral: true,
        })
    } else if (commandName === 'add') {
        const num1 = options.getNumber('num1')
        const num2 = options.getNumber('num2')

        // set a wait time of 5 seconds
        await interaction.deferReply({
            ephemeral: true
        })

        await new Promise(resolve => setTimeout(resolve, 5000))

        await interaction.editReply({
            content: `The sum is ${num1 + num2}`,
        })
    }
})

client.login(process.env.TOKEN)