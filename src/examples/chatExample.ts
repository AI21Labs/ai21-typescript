import { AI21 } from "../AI21";

/*
  This is a temporary example to test the API streaming/non-streaming functionality.
*/
async function main() {
  const client = new AI21({ apiKey: process.env.AI21_API_KEY });

  try {

    console.log('-------------------------------- streaming flow --------------------------------');

    const streamResponse = await client.chat.completions.create({
      model: 'jamba-1.5-mini',
      messages: [{ role: 'user', content: 'Hello, how are you? tell me a 100 line story about a cat' }],
      stream: true,
    });
    for await (const chunk of streamResponse) {
      process.stdout.write(chunk.choices[0]?.delta?.content || '');
    }

    console.log('-------------------------------- non streaming flow --------------------------------');

    const response = await client.chat.completions.create({
      model: 'jamba-1.5-mini',
      messages: [{ role: 'user', content: 'Hello, how are you? tell me a 100 line story about a cat' }],
      stream: false,
    });
    console.log(response);
  } catch (error) {
    console.error('Error:', error);
  }
}

main().catch(console.error);
