"use strict";

const builder = require("botbuilder");
const dialogs = require("./dialogs");
const bot = new builder.UniversalBot(
    new builder.ChatConnector(), 
    dialogs.<%= defaultDialog %>.dialog
);
<%= luisRegistration %>
module.exports = bot;
