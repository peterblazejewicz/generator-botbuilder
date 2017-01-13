import * as builder from 'botbuilder';

export default class Bot extends builder.UniversalBot {
    constructor() {
        super(new builder.ChatConnector());

        this.dialog('/', [
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
        ])
    }
}