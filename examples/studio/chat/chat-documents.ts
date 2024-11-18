import { AI21, DocumentSchema } from 'ai21';
import { v4 as uuidv4 } from 'uuid';

const document0: DocumentSchema = {
  id: uuidv4(),
  content: `Schnoodel Inc. Annual Report - 2024. Schnoodel Inc., a leader in innovative culinary technology,
   saw a 15% revenue growth this year, reaching $120 million. The launch of SchnoodelChef Pro has significantly contributed,
   making up 35% of total sales. We've expanded into the Asian market, notably Japan, and increased our global presence.
   Committed to sustainability, we reduced our carbon footprint by 20%. Looking ahead, we plan to integrate more advanced
   machine learning features and expand into South America.`,
  metadata: { topic: "revenue" },
}

const document1: DocumentSchema = {
    id: uuidv4(),
    content: `Shnokel Corp. Annual Report - 2024. Shnokel Corp., a pioneer in renewable energy solutions, "
    "reported a 20% increase in revenue this year, reaching $200 million. The successful deployment of "
    "our advanced solar panels, SolarFlex, accounted for 40% of our sales. We entered new markets in Europe "
    "and have plans to develop wind energy projects next year. Our commitment to reducing environmental "
    "impact saw a 25% decrease in operational emissions. Upcoming initiatives include a significant "
    "investment in R&D for sustainable technologies.`,
    metadata: { topic: "revenue" },
  }

const documents = [document0, document1]


async function main() {
  const client = new AI21({ apiKey: process.env.AI21_API_KEY });

  try {
    const response = await client.chat.completions.create({
      model: 'jamba-1.5-mini',
      messages: [
        { role: 'system', 
          content: "You are a helpful assistant that receives revenue documents and answers related questions" 
        },
        { role: 'user', content: '"Hi, which company earned more during 2024 - Schnoodel or Shnokel?"' }
      ],
      documents: documents,
    });
    console.log(response.choices[0].message);
  } catch (error) {
    console.error('Error:', error);
  }
}

main().catch(console.error);
