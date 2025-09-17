import { FileSearchTool, WebSearchTool } from './MaestroTools';

type MaestroRunResponseStatus = 'completed' | 'failed' | 'in_progress' | 'requires_action';

type MaestroRunRequirementResult = {
  score: number;
  finish_reason: string | null;
  requirements: {
    name: string | null;
    description: string | null;
    score: number | null;
    reason: string | null;
  };
};

type DataSources = {
  file_search?: FileSearchTool;
  web_search?: WebSearchTool;
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
  requirements_result: MaestroRunRequirementResult[];
}
