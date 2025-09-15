import { AI21 } from 'ai21';

async function main() {
  const client = new AI21({ apiKey: process.env.AI21_API_KEY });

  const { id } = await client.beta.maestro.runs.create({
    input: 'Hello, how are you? tell me a short story about a wizard',
  });

  const response = await client.beta.maestro.runs.get(id);

  console.log(response);
}

main().catch(console.error);
