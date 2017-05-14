# <%= botName %> Bot

This bot has been created using [Microsoft Bot Framework](https://dev.botframework.com), and scaffolded using the [Bot Builder Yeoman generator](https://github.com/GeekTrainer/generator-botbuilder).

This bot is designed to do the following:

<%= description %>

## Getting Started

### Structure

`app.<%= extension %>` references the bot and starts a [Restify](http://restify.com/) server. `bot.<%= extension %>` has a simple multi-turn dialog which sends the name and description of the bot, and then asks the user for their name.

### Running the bot

```
<%= launchSteps %>
```

If you are using [QnA Maker](https://qnamaker.ai), you must update `.env` with your KBID and subscription key.

### Configuring the bot

The template uses [dotenv](https://github.com/motdotla/dotenv) for managing application settings; all keys will be placed in the `.env` file during testing.