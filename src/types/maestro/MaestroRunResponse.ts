type MaestroRunResponseStatus = 'completed' | 'failed' | 'in_progress' | 'requires_action';

export type MaestroRunRequirement = {
  name: string;
  description: string;
  score: number;
  reason: string;
};

type MaestroRunRequirementResult = {
  score: number;
  finish_reason: string | null;
  requirements: MaestroRunRequirement[];
};

type FileSearchResult = {
  text?: string;
  file_id: string;
  file_name: string;
  score: number;
  order: number;
};

type WebSearchResult = {
  url: string;
  score: number;
  text: string;
};

type DataSources = {
  file_search?: FileSearchResult[];
  web_search?: WebSearchResult[];
};

export interface MaestroRunResponse {
  /* 
  The ID of the maestro run for polling the status.
  */
  id: string;
  status: MaestroRunResponseStatus;
  /* 
  The final result object, may vary based on task type.
  */
  result: string | null;
  /* 
  Specifies the data sources used to retrieve contextual information for a run.
  */
  data_sources: DataSources;
  /* 
  Detailed results for each requirement.
  */
  requirements_result: MaestroRunRequirementResult;
}
