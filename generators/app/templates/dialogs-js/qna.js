/* ----------------------------------------------------------------------------------
*   QnA Dialog
*   Sample dialog for use with QnA Maker 
*   You can find out more information about QnA Maker at https://qnamaker.ai
*       or at https://channel9.msdn.com/Events/Build/2017/p4074
*
*   To use:
*   1. Create a knowledge base at https://qnamaker.ai
*   2. Set the KBID and SUBSCRIPTION_KEY environmental variables
*       This can be done by updating .env, or setting the variables manually
*   3. No additional code updates are required
---------------------------------------------------------------------------------- */

const builder = require('botbuilder');
const restify = require('restify');

module.exports = {
    id: 'qna',
    name: 'qna',
    waterfall: [
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