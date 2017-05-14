"use strict";

const builder = require("botbuilder");
const dialogs = require("./dialogs");
const universalBot = new builder.UniversalBot(
    new builder.ChatConnector(), 
    dialogs.<%= defaultDialog %>.dialog
);

module.exports = universalBot;
