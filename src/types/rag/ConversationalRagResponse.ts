import { ChatMessage } from "../chat";
import { ConversationalRagSource } from "./ConversationalRagSource";

export interface ConversationalRagResponse {
    id: string;
    choices: ChatMessage[];
    search_queries?: string[] | null;
    context_retrieved: boolean;
    answer_in_context: boolean;
    sources: ConversationalRagSource[];
}
