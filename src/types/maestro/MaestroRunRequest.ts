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

type MaestroRunTool = 'file_search' | 'web_search';

export type MaestroToolResources = {
  /* 
  When provided, this object defines filters that AI21 Maestro will apply whenever it performs a file search.
  */
  file_search?: {
    /* 
    Restrict file search to these file IDs.
    */
    file_ids?: string[];
    /* 
    Restrict file search to files with these labels.
    */
    labels?: string[];
  };
  /* 
  When provided, this object defines filters that AI21 Maestro will apply whenever it performs a web search.
  */
  web_search?: {
    /* 
    Restrict web search to the specified URL prefixes.
    */
    urls: string[];
  };
};

type MaestroRunFirstPartyModel = 'jamba-mini' | 'jamba-large';

type MaestroRunManagedThirdPartyModel = 'gpt-4o' | 'mistral-7b' | 'mistral-8x7b' | 'mistral-small';

type MaestroRunModel = MaestroRunFirstPartyModel | MaestroRunManagedThirdPartyModel;

type MaestroRunBudget = 'low' | 'medium' | 'high';

type MaestroRunIncludeFields = 'data_sources' | 'requirements_result';

type MaestroRunResponseLanguage =
  | 'arabic'
  | 'dutch'
  | 'english'
  | 'french'
  | 'german'
  | 'hebrew'
  | 'italian'
  | 'portuguese'
  | 'spanish';

export interface MaestroRunRequest {
  /* 
  The input for the maestro run. Plain text instruction or input messages.
  */
  input: MaestroRunInput;
  /* 
  The requirements for the maestro run. Maximum 10 requirements.
  Works only if no tools are selected.
  */
  requirements?: MaestroRunRequirement[];
  /* 
  Tools for the maestro run.
  */
  tools?: MaestroRunTool[];
  /* 
  A set of resources used by AI21 Maestro’s tools.
  */
  tool_resources?: MaestroToolResources;
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