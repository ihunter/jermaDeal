require("dotenv").config();
const Discord = require("discord.js");
const parseCurrency = require("parsecurrency");
const parseTime = require("parse-duration");

// Database model
const { Deal } = require("./models");

const yesEmoji = "✅";
const noEmoji = "❌";
const channel = "deals";

const client = new Discord.Client({
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async (message) => {
    const prefix = process.env.PREFIX
    // Ignore bot messages
    if (message.author.bot) return

    // Only respond to messages with bot prefix
    if (message.content.startsWith(prefix)) {
        // remove prefix and get array of args including command
        const args = message.content.slice(prefix.length).trim().split(/\s+/)

        // Get command name from args array
        const command = args.shift().toLowerCase()

        if (command === 'dump') {
            try {
                // Get all deals in the database
                const deals = await Deal.findAll()
                message.channel.send(` \`\`\` ${JSON.stringify(deals)} \`\`\` `)
            } catch (error) {
                console.error('Error gettings deals from the database:', error)
            }
        }
    } else if (message.channel.name === channel) {
        const authorId = message.author.id
        const msgId = message.id

        let deal
        try {
            deal = await Deal.findOne({ where: { userId: authorId } })
        } catch (error) {
            console.error('Error checking database for existing entry:', error)
        }

        // Only one entry per person
        if (deal !== null) {
            message.author.send(`One submission per person please!\nYou may delete and resubmit as many times as you like however.`)
            return message.delete()
        }

        const dealData = await parseDeal(message)

        // Add vote reactions to the message
        await message.react(yesEmoji)
        await message.react(noEmoji)

        // Add challenge to database
        try {
            await Deal.create(dealData)
        } catch (error) {
            console.error('Error entering deal into the database:', error)
        }
    }
});

client.on("messageDelete", async (message) => {
    try {
        await Deal.destory({ where: { messageId: message.id } })
    } catch (error) {
        console.log("Error deleteing deal from the database:", error)
    }
});

client.on("messageReactionAdd", async (reaction) => {
    console.log(reaction)
});

client.on("messageReactionRemove", async (reaction) => {
    updateVotes(reaction);
});

async function parseDeal(message) {
    try {
        const deal = message.content.toLowerCase().split('\n')
        .map(entry => {
            return entry.split(':').map(e => e.trim())
        })

        const dealObj = Object.fromEntries(deal)

        if (!dealObj.challenge || !dealObj.worth) {
            const reply = await message.reply(`Formatting Incorrect. The correct formatting is: \n Challenge: \n (Optional) Time: \n Worth: `)
            await message.delete()
            await reply.delete({ timeout: 20000 })
        }

        if (dealObj.time) {
            dealObj.time = parseTime(dealObj.time, 'ms')
        }

        dealObj.worth = parseCurrency(dealObj.worth).value

        dealObj.userId = message.author.id
        dealObj.messageId = message.id
        dealObj.username = message.author.tag

        return dealObj
    } catch (error) {
        console.error("Error parsing message for deal:", error)
    }
}

async function updateVotes(reaction) {
    if(reaction.emoji.name === yesEmoji) {
        try {
            await Deal.update({ positive: reaction.count }, { where: { messageId: reaction.message.id } })
        } catch (error) {
            console.error("Error updating positive reaction count in the database", error)
        }
    } else if (reaction.emoji.name === noEmoji) {
        try {
            await Deal.update({ negative: reaction.count }, { where: { messageId: reaction.message.id } })
        } catch (error) {
            console.error("Error updating negative reaction count in the database", error)
        }
    }
}

client.login(process.env.discordToken);
