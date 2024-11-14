# AI21 API Client

The AI21 API Client is a TypeScript library that provides a convenient interface for interacting with the AI21 API. It abstracts away the low-level details of making API requests and handling responses, allowing developers to focus on building their applications.

## Installation

You can install the AI21 API Client using npm or yarn:

```bash
npm install ai21
```

or

```bash
yarn add ai21
```

## Usage

To use the AI21 API Client, you'll need to have an API key. You can obtain an API key by signing up for an account on the AI21 website.

Here's an example of how to use the `AI21` class to interact with the API:

```typescript
import { AI21 } from 'ai21';

const client = new AI21({
  apiKey: process.env.AI21_API_KEY, // or pass it in directly
});

const response = await client.chat.completions.create({
  model: 'jamba-1.5-mini',
  messages: [{ role: 'user', content: 'Hello, how are you? tell me a 100 line story about a cat named "Fluffy"' }],
});

console.log(response);
```

### Streaming Responses

The client supports streaming responses for real-time processing. Here are examples using different approaches:

#### Using Async Iterator

```typescript
const streamResponse = await ai21.chat.completions.create({
  model: 'jamba-1.5-mini',
  messages: [{ role: 'user', content: 'Write a story about a space cat' }],
  stream: true,
});

for await (const chunk of streamResponse) {
  console.log(chunk.choices[0]?.delta?.content || '');
}
```

The `AI21` class provides a `chat` property that gives you access to the Chat API. You can use this to generate text, complete prompts, and more.

## Configuration

The `AI21` class accepts several configuration options, which you can pass in when creating a new instance:

- `baseURL`: The base URL for the API endpoint (default: `https://api.ai21.com/studio/v1`)
- `apiKey`: Your AI21 API Key
- `maxRetries`: The maximum number of retries for failed requests (default: `3`)
- `timeout`: The request timeout in seconds

## API Reference

For detailed information about the available methods and their parameters, please refer to the [API reference documentation](https://docs.ai21.com/docs).

## Contributing

If you encounter any issues or have suggestions for improvements, please feel free to open an issue or submit a pull request on the [GitHub repository](https://github.com/ai21-labs/api-client).

## License

This library is licensed under the [Apache-2.0 License](LICENSE).
