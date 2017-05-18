# <%= botName %> Bot

This bot has been created using [Microsoft Bot Framework](https://dev.botframework.com), and scaffolded using the [Bot Builder Yeoman generator](https://github.com/GeekTrainer/generator-botbuilder).

This bot is designed to do the following:

<%= description %>

## Getting Started

### Dependencies

- **[Restify](http://restify.com)** Used to host the web service for the bot, and for making REST calls
- **[dotenv](https://github.com/motdotla/dotenv)** Used to manage environmental variables

### Structure

`app.<%= extension %>` references the bot and starts a Restify server. `bot.<%= extension %>` loads the dialog type you selected when running the generator and adds it as the default dialog. `dialogs.<%= extension %>` contains the list of sample dialogs.

### Configuring the bot

Update `.env` with the appropriate keys:

- KBID and SUBSCRIPTION_KEY for QnA Maker
- LUIS_MODEL_URL for LUIS
- App ID and Key for registered bots.

In the case of LUIS, you will need to update the dialog in `dialogs.<%= extension %>` to work with the appropriate intent and entities.

### The dialogs

- Echo dialog is designed for simple Hello, World demos and to get you started.
- LUIS dialog has the basic code to retrieve an entity

### Running the bot

```
<%= launchSteps %>
```

## Additional Resources

- [Microsoft Virtual Academy Bots Course](http://aka.ms/botcourse)
- [Bot Framework Documentation](https://docs.botframework.com)
- [LUIS](https://luis.ai)
- [QnA Maker](https://qnamaker.ai)