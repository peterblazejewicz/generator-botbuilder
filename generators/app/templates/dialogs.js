"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const restify = require("restify");
const builder = require("botbuilder");

exports.echoDialog = {
    id: 'echo',
    name: 'echo',
    dialog: [
        (session, args, next) => {
            const botName = '<%= botName %>';
            const description = `<%= botDescription %>`;
            session.send(`Hi there! I'm ${botName}`);
            session.send(`In a nutshell, here's what I can do:\n\n${description}`);
            builder.Prompts.text(session, `What's your name?`);
        },
        (session, results, next) => {
            session.endConversation(`Welcome, ${results.response}`);
        },
    ]
};

exports.luisDialog = {
    id: 'luis',
    name: 'luis',
    dialog: [
        (session, args, next) => {
            const entity = builder.EntityRecognizer.findEntity(args.entities, 'entity');
            if (entity)
                next({ response: entity.entity });
            else
                builder.Prompts.text(session, 'Please provide entityName');
        },
        (session, results, next) => {
            session.endConversation(`You said ${results.response}`);
        }
    ]
};

exports.qnaDialog = {
    id: 'qna',
    name: 'qna',
    dialog: [
        (session, args, next) => {
            const question = session.message.text;
            if (!question) {
                session.endConversation(`Sorry, I can't answer that question.`);
                return;
            }
            session.sendTyping();
            const bodyText = JSON.stringify({ question: question });
            const url = `https://westus.api.cognitive.microsoft.com`;
            const path = `/qnamaker/v1.0/knowledgebases/${process.env.KBID}/generateAnswer`;
            const jsonClient = restify.createJsonClient({
                url,
                headers: {
                    'Ocp-Apim-Subscription-Key': process.env.SUBSCRIPTION_KEY
                }
            });
            jsonClient.post(path, { question }, (err, req, res, obj) => {
                if (err) {
                    session.endConversation(`Sorry, something went wrong when connecting to the server`);
                    return;
                }
                if (obj.score > 50) {
                    session.endConversation(obj.answer);
                }
                else if (obj.score > 0) {
                    session.send(`I'm not sure if this is right...`);
                    session.endConversation(obj.answer);
                }
                else {
                    session.endConversation(`I don't have that answer.`);
                }
            });
        }
    ]
};
