import { AI21 } from '../AI21';

/*
  This is a temporary example to test the Conversational RAG functionality.
*/
async function main() {
  /* TODO - add a file upload example when library support is added and combine it with the below flow */

  const client = new AI21({ apiKey: process.env.AI21_API_KEY });
  try {
    /* The following example is for a question that is not in the context of files uploaded to RAG */

    const answer_not_in_ctx_response = await client.conversationalRag.create({
      messages: [{ role: 'user', content: 'Who is the Russian president?' }],
    });
    console.log(answer_not_in_ctx_response);

    /* The following example is for a question that should be answered based on files uploaded to RAG */

    const answer_in_ctx_response = await client.conversationalRag.create({
      messages: [{ role: 'user', content: 'What is headace?' }],
    });
    console.log(answer_in_ctx_response);
  } catch (error) {
    console.error('Error:', error);
  }
}

main().catch(console.error);
