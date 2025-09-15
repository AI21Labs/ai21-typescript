import { APIResource } from '../../APIResource';
import { Files } from './files';

export class Library extends APIResource {
  files: Files = new Files(this.client);
}
