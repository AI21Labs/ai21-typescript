import { AI21 } from 'ai21';

const TIMEOUT = 20000;
const INTERVAL = 1500;

async function main() {
  const client = new AI21({ apiKey: process.env.AI21_API_KEY });

  const response = await client.beta.maestro.runs.createAndPoll(
    {
      input: 'Write a poem about the ocean',
      requirements: [
        {
          name: 'length requirement',
          description: 'The length of the poem should be less than 1000 characters',
        },
        {
          name: 'rhyme requirement',
          description: 'The poem should rhyme',
        },
      ],
      include: ['requirements_result'],
    },
    {
      timeout: TIMEOUT,
      interval: INTERVAL,
    },
  );
  console.log(response);
}

main().catch(console.error);
