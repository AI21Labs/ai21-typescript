import { AI21, ChatMessage, ToolDefinition } from 'ai21';

// Mock database function
const getOrderDeliveryDate = (orderId: string): string => {
  console.log(`Retrieving the delivery date for order ID: ${orderId} from the database...`);
  return '2025-05-04';
};

async function main() {
  const client = new AI21({ apiKey: process.env.AI21_API_KEY });

  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: 'You are a helpful customer support assistant. Use the supplied tools to assist the user.',
    },
    { role: 'user', content: 'Hi, can you tell me the delivery date for my order?' },
    { role: 'assistant', content: 'Hi there! I can help with that. Can you please provide your order ID?' },
    { role: 'user', content: 'i think it is order_12345' },
  ];

  const tools: ToolDefinition[] = [
    {
      type: 'function',
      function: {
        name: 'get_order_delivery_date',
        description: 'Retrieve the delivery date associated with the specified order ID',
        parameters: {
          type: 'object',
          properties: {
            order_id: {
              type: 'string',
              description: "The customer's order ID.",
            },
          },
          required: ['order_id'],
        },
      },
    },
  ];

  try {
    // First response with streaming
    const response = await client.chat.completions.create({
      model: 'jamba-1.5-large',
      messages,
      tools,
    });

    const assistantMessage = response.choices[0].message;
    console.log(assistantMessage);

    messages.push(assistantMessage);

    // Handle tool calls
    if (assistantMessage.tool_calls?.length) {
      const toolCall = assistantMessage.tool_calls[0];
      if (toolCall.function.name === 'get_order_delivery_date') {
        const args = JSON.parse(toolCall.function.arguments);
        if (args.order_id) {
          const deliveryDate = getOrderDeliveryDate(args.order_id);

          // Add tool response to messages
          messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: deliveryDate,
          });

          // Get final response
          const finalResponse = await client.chat.completions.create({
            model: 'jamba-1.5-large',
            messages,
            tools,
          });

          console.log(finalResponse.choices[0].message);
        }
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

main().catch(console.error);
