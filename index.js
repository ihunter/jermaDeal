const Discord = require('discord.js');
const parseCurrency = require('parsecurrency');
const parseTime = require('parse-duration');
const fs = require("fs");

const { Challenge } = require('./models')

const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

const LocalDatabase = require("./LocalDatabase");

const yesEmoji = "✅";
const noEmoji = "❌";
const channel = "deals";

const filterReacts = (reaction) => (reaction.emoji.name === yesEmoji || reaction.emoji.name === noEmoji) && reaction.message.channel.name === channel && message.author.bot != true;

require('dotenv').config();

function parseMessage(message) {
    var time = ""; //dummy variable in case it doesn't get set
    var type = ""; //TODO: add types
    var challenge = null;
    var worth = null;
    var positive = 0;
    var negative = 0;
    messageLines = message.split("\n");

    var errorMessage = new Array();

    if(messageLines.length < 1) {
        errorMessage.push("Formatting Incorrect. The correct formatting is: \n Challenge: \n (Optional) Time: \n Worth: ");
        return errorMessage;
    }

    for(i = 0; i < messageLines.length; i++){
        var lineValue = messageLines[i].split(": ");
        switch(lineValue[0].toLowerCase()) {
            case("challenge"): {
                console.log("Challenge is " + lineValue[1]);
                challenge = lineValue[1];
                break;
            }
            case("time"): {
                try {
                    var parsedTime = parseTime(lineValue[1], 'ms'); //set format
                    console.log("Time is (in milliseconds) " + parsedTime);
                    time = parsedTime;
                    if(time == null) {
                        errorMessage.push("Couldn't parse a time out of your submission!");
                    }
                } catch (e) {
                    errorMessage.push("Not a valid time");
                    break;
                }
                break;
            }
            case("worth"): {
                try {
                    var money = parseCurrency(lineValue[1]);
                    console.log("Money is " + money.value);
                    worth = money.value;
                } catch (e) {
                    errorMessage.push("Not a valid money declaration");
                    break;
                }
                break;
            }
            default: {
                var description = lineValue[1];
                break;
            }
        }
    }
    if(errorMessage.length > 0) {
        console.log("bad message");
        console.log(errorMessage);
        return errorMessage;
    }
    else{
        
        try {
            return new Object({challenge, time, worth, type, positive, negative});
        } catch (e) {
            errorMessage.push("Formatting Incorrect. The correct formatting is: \n Challenge: \n (Optional) Time: \n Worth: ");
            return errorMessage;
        }
    }
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

const fakeDelete = new Array([]);

client.on('message', async (message) => {
    if (message.content.startsWith("!deal dump")) { //DEBUG
        let db = JSON.parse(fs.readFileSync("./db.json")) || {}; //DEBUG
        message.channel.send("```\n" + JSON.stringify(db) + "```"); //DEBUG
    } else { //DEBUG
    if(message.channel.name === channel && message.author.bot != true) {
        const challenge = await Challenge.findOne({ where: { userId: message.author.id } })
        if(LocalDatabase.Get(message.author.id) === null && challenge === null) {
            console.log(message.channel.name);
            var messageObject = parseMessage(message.content);
            if(Array.isArray(messageObject) === true) {
                message.author.send(messageObject.join("\n"));
                message.delete();
            } else {
                LocalDatabase.Set(message.author.id, messageObject);
                try {                    
                    await Challenge.create({
                        userId: message.author.id,
                        messageId: message.id,
                        title: messageObject.challenge,
                        time: messageObject.time || null,
                        description: messageObject.description || null,
                        worth: messageObject.worth,
                        type: messageObject.type || null,
                        username: messageObject.username || null,
                        negative: messageObject.negative,
                        positive: messageObject.positive
                    })
                } catch (error) {
                    console.error(error)
                }
                console.log(message.author.id);
                message.react("✅");
                message.react("❌");
                // message.createReactionCollector(filter);
            }
        } else {
            message.author.send("One submission per person please!\nYou may delete and resubmit as many times as you like however.");
            fakeDelete.push(message.author.id);
            message.delete();
        }
    }
    } //DEBUG
});


client.on('messageDelete', async (message) => {
    if (message.partial) {
            try {
                // await message.fetch(true);
                // LocalDatabase.Set(message.author.id, null);
                await Challenge.destroy({ where: { messageId: message.id } })
            } catch (error) {
                return console.error('Something went wrong when fetching the message: ', error);
            }
        }
    else if(message.channel.name === channel && message.author.bot != true) {
        if(fakeDelete.includes(message.author.id)) {
            var index = fakeDelete.indexOf(message.author.id);
            if (index > -1) {
                fakeDelete.splice(index, 1);
            }
        }
        else if(await LocalDatabase.Get(message.author.id) != null) {
            LocalDatabase.Set(message.author.id, null);
            try {
                await Challenge.destroy({ where: { userId: message.author.id } })
            } catch (error) {
                console.error(error)
            }
        }
    }
});

client.on('messageReactionAdd', async (reaction) => {
    updateVotes(reaction);
});

client.on('messageReactionRemove', async (reaction) => {
    updateVotes(reaction);
});

async function updateVotes (reaction) {
	// When we receive a reaction we check if the reaction is partial or not
	if (reaction.partial) {
		// If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
		try {
			await reaction.fetch();
		} catch (error) {
            console.log('ERROR IS HERE')
			console.error('Something went wrong when fetching the message: ', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
    }
    // console.log(reaction.message.author.id);
    try {
        messageObject = LocalDatabase.Get(reaction.message.author.id);
        switch(reaction.emoji.name){
            case(yesEmoji): {
                messageObject.positive = reaction.count;
                LocalDatabase.Set(reaction.message.author.id, messageObject);
                await Challenge.update({ positive: reaction.count }, { where: { userId: reaction.message.author.id }})
                break;
            }
            case(noEmoji): {
                messageObject.negative = reaction.count;
                LocalDatabase.Set(reaction.message.author.id, messageObject);
                await Challenge.update({ negative: reaction.count }, { where: { userId: reaction.message.author.id }})
                break;
            }
            default: {
                console.log("Someone reacted with an emote thats not counted monkuh ess");
            }
        }
    }
    catch (e) {
        console.log("Person reacted to is not in DB!!"); //TODO add it if its not in there
        var newMessageObject = parseMessage(reaction.message.content);
        if(Array.isArray(newMessageObject) === true) {
            reaction.message.author.send(newMessageObject.join("\n"));
            reaction.message.delete();
        } else {
            LocalDatabase.Set(reaction.message.author.id, newMessageObject);
            // await Challenge.create({
            //     userId: reaction.message.author.id,
            //     title: newMessageObject.challenge,
            //     time: newMessageObject.time || null,
            //     description: newMessageObject.description || null,
            //     worth: newMessageObject.worth,
            //     type: newMessageObject.type || null,
            //     username: newMessageObject.username || null,
            //     negative: newMessageObject.negative,
            //     positive: newMessageObject.positive
            // })
            console.log(reaction.message.author.id);
            reaction.message.react("✅");
            reaction.message.react("❌");
            // message.createReactionCollector(filter);
        }

    }
}

client.login(process.env.discordToken);
