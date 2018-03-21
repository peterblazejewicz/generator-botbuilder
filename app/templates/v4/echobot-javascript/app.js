const {BotFrameworkAdapter, MemoryStorage, ConversationState} = require('botbuilder');
const restify = require('restify');

// Create server
let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
  console.log(`${server.name} listening to ${server.url}`);
});

// Create adapter
const adapter = new BotFrameworkAdapter({
  get appId() {
    if (process.env.MICROSOFT_APP_ID) {
      return process.env.MICROSOFT_APP_ID;
    }
    throw new ReferenceError('Cannot find the Microsoft app ID. Did you include it in your environment variables?');
  },
  get appPassword() {
    if (process.env.MICROSOFT_APP_PASSWORD) {
      return process.env.MICROSOFT_APP_PASSWORD;
    }
    throw new ReferenceError('Cannot find the Microsoft app password. Did you include it in your environment variables?');
  }
});

// Add conversation state middleware
const conversationState = new ConversationState(new MemoryStorage());
adapter.use(conversationState);

// Listen for incoming requests
server.post('/api/messages', (req, res) => {
  // Route received request to adapter for processing
  adapter.processRequest(req, res, (context) => {
    if (context.request.type === 'message') {
      const state = conversationState.get(context);
      const count = state.count === undefined ? state.count = 0 : ++state.count;
      return context.sendActivity(`${count}: You said "${context.request.text}"`);
    } else {
      return context.sendActivity(`[${context.request.type} event detected]`);
    }
  });
});
