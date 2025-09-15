import { APIResource } from '../../APIResource';
import { Maestro } from './maestro';

export class Beta extends APIResource {
  maestro: Maestro = new Maestro(this.client);
}
