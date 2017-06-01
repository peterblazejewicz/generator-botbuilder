import * as builder from 'botbuilder';
import { <%= defaultDialog %> } from './dialogs';

const bot = new builder.UniversalBot(
    new builder.ChatConnector({
        appId: process.env.MICROSOFT_APP_ID,
        appPassword: process.env.MICROSOFT_APP_PASSWORD
    }),
    <%= defaultDialog %>.dialog
);
<%= luisRegistration %>
export default bot;
