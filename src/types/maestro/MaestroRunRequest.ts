import { FileSearchTool, HttpTool, MCPTool, WebSearchTool } from './MaestroTools';

type MaestroRunInputObject = {
  role: string;
  content: string;
};

type MaestroRunInput = string | MaestroRunInputObject[];

type MaestroRunRequirement = {
  name: string;
  description: string;
  isMandatory?: boolean;
};

type MaestroRunTool = HttpTool | MCPTool | FileSearchTool | WebSearchTool;

type MaestroRunFirstPartyModel = 'jamba-mini' | 'jamba-large';

type MaestroRunManagedThirdPartyModel = string;

type MaestroRunModel = MaestroRunFirstPartyModel | MaestroRunManagedThirdPartyModel;

type MaestroRunBudget = 'low' | 'medium' | 'high';

type MaestroRunIncludeFields = 'data_sources' | 'requirements_result' | string;

export type MaestroRunResponseLanguage =
  | 'arabic'
  | 'dutch'
  | 'english'
  | 'french'
  | 'german'
  | 'hebrew'
  | 'italian'
  | 'portuguese'
  | 'spanish'
  | 'unset'
  | string;

export interface MaestroRunRequest {
  /* 
  The input for the maestro run. Plain text instruction or input messages.
  */
  input: MaestroRunInput;
  /* 
  The requirements for the maestro run. Maximum 10 requirements.
  */
  requirements?: MaestroRunRequirement[];
  /* 
  Tools for the maestro run.
  */
  tools?: MaestroRunTool[];
  /* 
  The models to use for the maestro run.
  */
  models?: MaestroRunModel[];
  /* 
  Controls how many resources AI21 Maestro allocates to fulfill the requirements.
  */
  budget?: MaestroRunBudget;
  /* 
  Specify which extra fields to include in the output.
  */
  include?: MaestroRunIncludeFields[];
  /* 
  Controls the output language of AI21 Maestro responses
  */
  response_language?: MaestroRunResponseLanguage;
}

export interface MaestroRunRequestOptions {
  timeout?: number;
  interval?: number;
}
