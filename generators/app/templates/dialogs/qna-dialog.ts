import * as restify from 'restify';
import * as builder from 'botbuilder';
import { IDialog } from './idialog';

interface IQnAAnswer {
    answer: string;
    score: number;
}

export const qnaDialog: IDialog = {
    id: 'qna',
    name: 'qna',
    waterfall: [
        (session: builder.Session, args: any, next: Function) => {
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

            jsonClient.post(path, { question }, (err, req, res, obj: IQnAAnswer) => {
                if (err) {
                    session.endConversation(`Sorry, something went wrong when connecting to the server`);
                    return;
                }

                if (obj.score > 50) {
                    session.endConversation(obj.answer);
                } else if (obj.score > 0) {
                    session.send(`I'm not sure if this is right...`);
                    session.endConversation(obj.answer);
                } else {
                    session.endConversation(`I don't have that answer.`);
                }
            });
        }
    ]
}