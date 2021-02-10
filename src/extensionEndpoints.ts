import axios from 'axios';

const extensionID = process.env.EXTENSION_ID;

export async function searchExtensionData(query: string, options: { indexes: string[], page?: number }) {
  const result = await axios.post(`https://api.usedevbook.com/extensions/${extensionID}/entry/query`, {
    query,
    ...options.indexes,
  }, {
    params: {
      env: process.env.EXTENSION_MODE,
      page: options.page || 10,
    },
  });
  return result.data;
}
