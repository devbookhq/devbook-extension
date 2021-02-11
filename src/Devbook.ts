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

  public async search(indexes: string[] | string, query: string, page: number = 1, pageSize: number = 10): Promise<Result[]> {
    return this.request({
      method: 'POST',
      route: '/entry/query',
      data: {
        indexes,
        query,
      },
      params: {
        page,
        pageSize,
      },
    });
  }

  public async entry(index: string, id: string): Promise<Result> {
    return this.request({
      method: 'GET',
      route: `/entry/${id}`,
      data: {
        index,
      },
    });
  }

  public async entries(index: string, page: number, pageSize: number): Promise<Result[]> {
    return this.request({
      method: 'GET',
      route: '/entry',
      data: {
        index,
      },
      params: {
        page,
        pageSize,
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
