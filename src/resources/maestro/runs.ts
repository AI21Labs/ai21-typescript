import { TimeoutError } from '../../errors';
import { APIResource } from '../../APIResource';
import { MaestroRunRequest, MaestroRunResponse, RequestOptions, MaestroRunRequestOptions } from '../../types';
import { DEFAULT_INTERVAL, DEFAULT_TIMEOUT } from '../../Constants';

const MAESTRO_PATH = '/maestro/runs';
const MAESTRO_TERMINATED_RUN_STATUSES = ['completed', 'failed', 'requires_action'];

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
      if (MAESTRO_TERMINATED_RUN_STATUSES.includes(response.status)) {
        return response;
      }

      await new Promise((resolve) => setTimeout(resolve, interval));
    }

    throw new TimeoutError(`Maestro run ${runId}`, timeout);
  }

  async createAndPoll(
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
