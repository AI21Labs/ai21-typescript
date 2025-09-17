interface HttpToolFunctionParametersProperty {
  type: string;
  description: string;
}

interface HttpToolFunctionParameters {
  type: 'object';
  properties: Record<string, HttpToolFunctionParametersProperty>;
  required: string[];
  additional_properties?: boolean;
}

interface HttpToolFunction {
  name: string;
  description: string;
  parameters: HttpToolFunctionParameters;
}

interface HttpToolEndpoint {
  url: string;
  headers?: Record<string, string>;
}

export interface HttpTool {
  type: 'http';
  function: HttpToolFunction;
  endpoint: HttpToolEndpoint;
}

export interface MCPTool {
  type: 'mcp';
  server_label: string;
  server_url: string;
  headers?: Record<string, string>;
  allowed_tools?: string[];
}

export interface FileSearchTool {
  type: 'file_search';
  retrieval_similarity_threshold?: number;
  labels?: string[];
  labels_filter_mode?: 'AND' | 'OR';
  labels_filter?: Record<string, unknown>;
  file_ids?: string[];
  retrieval_strategy?: string;
  max_neighbors?: number;
}

export interface WebSearchTool {
  type: 'web_search';
  urls?: string[];
}
