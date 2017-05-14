import * as builder from 'botbuilder';
import { <%= defaultDialog %> } from './dialogs';

const universalBot = new builder.UniversalBot(
    new builder.ChatConnector(),
    <%= defaultDialog %>.dialog
);

export const bot = universalBot;