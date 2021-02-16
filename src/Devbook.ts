import axios, { Method } from 'axios';
import { Result } from './event';

enum APIVersion {
  v1 = 'v1',
}

interface ExtensionInfo {
  extensionID: string;
  indexes: string[];
}

interface DevbookOptions {
  apiVersion?: APIVersion;
}

class Devbook {
  private apiVersion = APIVersion.v1;

  public constructor(options?: DevbookOptions) {
    if (options?.apiVersion) {
      this.apiVersion = options.apiVersion;
    }
  }

  private async request(options: { method: Method, route?: string, data?: any, params?: any }) {
    if (!process.env.EXTENSION_ID) {
      throw new Error('Environment variable "EXTENSION_ID" is not defined.');
    }

    if (!process.env.ACCESS_TOKEN) {
      throw new Error('Environment variable "ACCESS_TOKEN" is not defined.');
    }

    const { method, route, data, params } = options;
    const result = await axios({
      url: `https://api.usedevbook.com/${this.apiVersion}/extension/${process.env.EXTENSION_ID}${route ? route : ''}`,
      method,
      data,
      params,
      headers: {
        'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
      },
    })
    return result.data;
  }


  public async search(
    indexes: string[] | string,
    query: string,
    pageSize: number = 10,
    pageNumber: number = 0): Promise<Result[]> {
    return this.request({
      method: 'POST',
      route: '/entry/query',
      params: {
        indexes,
        pageSize,
        pageNumber,
      },
      data: {
        query,
      },
    });
  }

  public async entry(index: string, id: string): Promise<Result> {
    return this.request({
      method: 'GET',
      route: `/entry`,
      params: {
        index,
        entryID: id,
      },
    });
  }

  public async entries(index: string, pageSize: number = 100, pageID?: string): Promise<{ entries: Result[], pageID: string }> {
    return this.request({
      method: 'GET',
      route: '/entry',
      params: {
        index,
        pageSize,
        pageID,
      }
    });
  }

  public async info(): Promise<ExtensionInfo> {
    return this.request({
      method: 'GET',
    });
  }
}

export default Devbook;
