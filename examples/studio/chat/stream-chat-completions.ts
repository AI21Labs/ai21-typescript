import { AI21 } from 'ai21';

async function main() {
  const client = new AI21({ apiKey: process.env.AI21_API_KEY });

  try {
    const streamResponse = await client.chat.completions.create({
      model: 'jamba-1.5-mini',
      messages: [{ role: 'user', content: 'Hello, how are you? tell me a short story' }],
      stream: true,
    });

    for await (const chunk of streamResponse) {
      if (chunk?.choices?.[0]?.delta?.content) {
        console.log(chunk.choices[0].delta.content);
      }
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

main().catch(console.error);
