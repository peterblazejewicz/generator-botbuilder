const builder = require('botbuilder');

const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

const bot = new builder.UniversalBot(connector);

bot.dialog('/', [
    (session, args, next) => {
        const botName = '<%= botName %>';
        const description = `<%= description %>`;

        session.send(`Hi there! I'm ${botName}`);
        session.send(`In a nutshell, here's what I can do:\n\n${description}`);

        builder.Prompts.text(session, `What's your name?`);
    },
    (session, results, next) => {
        session.endConversation(`Welcome, ${results.response}`);
    }
]);

module.exports = bot;