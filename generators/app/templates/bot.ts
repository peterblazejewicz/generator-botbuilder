import * as builder from 'botbuilder';

export default class extends builder.UniversalBot {
    constructor() {
        super(new builder.ChatConnector({
                appId: process.env.MICROSOFT_APP_ID,
                appPassword: process.env.MICROSOFT_APP_PASSWORD
            }),
            [
                (session, args, next) => {
                    const botName = 'sample';
                    const description = `sample`;

                    session.send(`Hi there! I'm ${botName}`);
                    session.send(`In a nutshell, here's what I can do:\n\n${description}`);

                    builder.Prompts.text(session, `What's your name?`);
                },
                (session, results, next) => {
                    session.endConversation(`Welcome, ${results.response}`);
                },
            ]
        );
    }
}