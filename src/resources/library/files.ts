import * as Models from '../../types';
import { APIResource } from '../../APIResource';
import { UploadFileResponse, UploadFileRequest, ListFilesFilters, UpdateFileRequest } from '../../types';
import { FileResponse } from 'types/files/FileResponse';

const FILES_PATH = '/library/files';

export class Files extends APIResource {
  async create(body: UploadFileRequest, options?: Models.RequestOptions): Promise<UploadFileResponse> {
    const { file, ...bodyWithoutFile } = body;
    return this.client.upload<Models.UnifiedFormData, UploadFileResponse>(FILES_PATH, file, {
      body: bodyWithoutFile,
      ...options,
    } as Models.RequestOptions<Models.UnifiedFormData>) as Promise<UploadFileResponse>;
  }

  async get(fileId: string, options?: Models.RequestOptions): Promise<FileResponse> {
    return this.client.get<string, FileResponse>(
      `${FILES_PATH}/${fileId}`,
      options as Models.RequestOptions<string>,
    ) as Promise<FileResponse>;
  }

  async delete(fileId: string, options?: Models.RequestOptions): Promise<null> {
    return this.client.delete<string, null>(
      `${FILES_PATH}/${fileId}`,
      options as Models.RequestOptions<string>,
    ) as Promise<null>;
  }

  async list(body?: ListFilesFilters, options?: Models.RequestOptions): Promise<FileResponse[]> {
    return this.client.get<ListFilesFilters | null, FileResponse[]>(FILES_PATH, {
      query: body,
      ...options,
    } as Models.RequestOptions<ListFilesFilters | null>) as Promise<FileResponse[]>;
  }

  async update(body: UpdateFileRequest, options?: Models.RequestOptions): Promise<null> {
    return this.client.put<UpdateFileRequest, null>(`${FILES_PATH}/${body.fileId}`, {
      body,
      ...options,
    } as Models.RequestOptions<UpdateFileRequest>) as Promise<null>;
  }
}
