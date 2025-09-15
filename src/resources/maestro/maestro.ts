import { APIResource } from '../../APIResource';
import { Runs } from './runs';

export class Maestro extends APIResource {
  runs: Runs = new Runs(this.client);
}
