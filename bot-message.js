const axios = require("axios");
const qs = require('querystring');
const moment = require("moment");

const connectUrl = "https://login.microsoftonline.com/botframework.com/oauth2/v2.0/token";
const appId = process.env.microsoftAppID;
const connectData = {
    grant_type: "client_credentials",
    client_id: appId,
    client_secret: process.env.microsoftAppPassword,
    scope: appId+"/.default"
}

let accessToken;

async function connect(){
    try{
        const res = await axios.post(connectUrl, qs.stringify(connectData), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        accessToken = res.data.access_token;
        return res;
    } catch(e) {
        console.log(e);
    }
}

const botUrl = process.env.BOT_URL+"/api/messages"

function sendMessage(msg){
    try{
        const messageBody = {
            type: "message",
            text: msg,
            id: "36a2e4f9-0bbc-437b-b0fc-815ed793ed5",
            channelId: "emulator",
            conversation: {
                id: "1534154912"
            },
            from: {
                id: "loadTester"
            },
            recipient: {
                id: ""
            },
            serviceUrl: (process.env.SERVICE_URL || process.env.BOT_URL) + "/api"
        }
        console.log(`${moment().format("h:mm:ss SSS a")} ${msg}`.green);
        axios.post(botUrl, messageBody, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            }
        })
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    connect, sendMessage 
}
