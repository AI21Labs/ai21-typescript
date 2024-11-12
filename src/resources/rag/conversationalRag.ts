import * as Models from '../../types';
import { APIResource } from '../../APIResource';
import { ConversationalRagRequest } from '../../types/rag/ConversationalRagRequest';
import { ConversationalRagResponse } from '../../types/rag/ConversationalRagResponse';

export class ConversationalRag extends APIResource {

  create(body: ConversationalRagRequest, options?: Models.RequestOptions){
    return this.client.post<ConversationalRagRequest, ConversationalRagResponse>(
      '/conversational-rag',
      {
        body,
        ...options,
      } as Models.RequestOptions<ConversationalRagRequest>,
    ) as Promise<ConversationalRagResponse>;
  }
}
