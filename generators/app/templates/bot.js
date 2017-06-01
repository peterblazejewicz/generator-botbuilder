"use strict";

const builder = require("botbuilder");
const dialogs = require("./dialogs");
const bot = new builder.UniversalBot(
    new builder.ChatConnector({
        appId: process.env.MICROSOFT_APP_ID,
        appPassword: process.env.MICROSOFT_APP_PASSWORD
    }), 
    dialogs.<%= defaultDialog %>.dialog
);
<%= luisRegistration %>
module.exports = bot;
