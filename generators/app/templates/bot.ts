import * as builder from 'botbuilder';

const bot = new builder.UniversalBot(
    new builder.ChatConnector(), [
        (session, args, next) => {
            const botName = '<%= botName %>';
            const description = `<%= description %>`;

            session.send(`Hi there! I'm ${botName}`);
            session.send(`In a nutshell, here's what I can do:\n\n${description}`);

            builder.Prompts.text(session, `What's your name?`);
        },
        (session, results, next) => {
            session.endConversation(`Welcome, ${results.response}`);
        },
    ]
)

export default bot;