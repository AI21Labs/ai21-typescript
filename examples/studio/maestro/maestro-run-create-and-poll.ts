import { AI21 } from 'ai21';

const TIMEOUT = 20000;
const INTERVAL = 1500;

async function main() {
  const client = new AI21({ apiKey: process.env.AI21_API_KEY });

  const response = await client.beta.maestro.runs.create_and_poll(
    {
      input: 'Hello, how are you? tell me a short story about a wizard',
    },
    {
      timeout: TIMEOUT,
      interval: INTERVAL,
    },
  );
  console.log(response);
}

main().catch(console.error);
