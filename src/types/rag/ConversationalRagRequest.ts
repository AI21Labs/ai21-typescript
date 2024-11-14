import { ChatMessageParam } from '../chat';
import { RetrievalStrategy } from './RetrievalStrategy';

export interface ConversationalRagRequest {
  messages: ChatMessageParam[];
  path?: string | null;
  labels?: string[] | null;
  file_ids?: string[] | null;
  max_segments?: number | null;
  retrieval_strategy?: RetrievalStrategy | string | null;
  retrieval_similarity_threshold?: number | null;
  max_neighbors?: number | null;
  hybrid_search_alpha?: number | null;
}
