import { APIResource } from '../../APIResource';
import { MaestroRunRequest, MaestroRunResponse, RequestOptions, MaestroRunRequestOptions } from '../../types';

const MAESTRO_PATH = '/maestro/runs';
const DEFAULT_TIMEOUT = 30000;
const DEFAULT_INTERVAL = 1000;

export class Runs extends APIResource {
  async create(body: MaestroRunRequest): Promise<MaestroRunResponse> {
    return this.client.post<MaestroRunRequest, MaestroRunResponse>(MAESTRO_PATH, {
      body,
    } as RequestOptions<MaestroRunRequest>) as Promise<MaestroRunResponse>;
  }

  async get(runId: string): Promise<MaestroRunResponse> {
    return this.client.get<string, MaestroRunResponse>(
      `${MAESTRO_PATH}/${runId}`,
    ) as Promise<MaestroRunResponse>;
  }

  private async poll({
    runId,
    timeout,
    interval,
  }: {
    runId: string;
    timeout: number;
    interval: number;
  }): Promise<MaestroRunResponse> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const response = await this.get(runId);
      if (response.status === 'completed') {
        return response;
      }

      await new Promise((resolve) => setTimeout(resolve, interval));
    }

    throw new Error(`Maestro run ${runId} timed out after ${timeout}ms`);
  }

  async create_and_poll(
    body: MaestroRunRequest,
    options?: MaestroRunRequestOptions,
  ): Promise<MaestroRunResponse> {
    const response = await this.create(body);
    return this.poll({
      runId: response.id,
      timeout: options?.timeout ?? DEFAULT_TIMEOUT,
      interval: options?.interval ?? DEFAULT_INTERVAL,
    });
  }
}
