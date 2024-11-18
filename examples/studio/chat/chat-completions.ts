import { AI21 } from 'ai21';

async function main() {
  const client = new AI21({ apiKey: process.env.AI21_API_KEY });

  try {
    const response = await client.chat.completions.create({
      model: 'jamba-1.5-mini',
      messages: [{ role: 'user', content: 'Hello, how are you? tell me a 100 line story about a cat' }],
    });
    console.log(response);
  } catch (error) {
    console.error('Error:', error);
  }
}

main().catch(console.error);
