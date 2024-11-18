import { AI21, ResponseFormat } from 'ai21';

async function main() {
  const client = new AI21({ apiKey: process.env.AI21_API_KEY });
  const responseFormat: ResponseFormat = { type: 'json_object' };
  const messages = [
    {
      role: 'user' as const,
      content: `Please create a JSON object for ordering zoo tickets for September 22, 2024, 
                     for myself and two kids, based on the following JSON schema: ${JSON.stringify({
                       date: 'string',
                       tickets: [
                         {
                           ticket_type: ['adult', 'child'],
                           quantity: 'number',
                         },
                       ],
                     })}`,
    },
  ];

  try {
    const response = await client.chat.completions.create({
      messages,
      model: 'jamba-1.5-large',
      responseFormat,
    });

    const content = response.choices[0].message.content;
    console.log('Response:', content);
  } catch (error) {
    console.error('Error:', error);
  }
}

main().catch(console.error);
