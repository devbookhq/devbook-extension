import axios from 'axios';

const extensionID = process.env.EXTENSION_ID;

export async function searchExtensionData(query: string, options: { indexes: string[], page?: number }) {
  const result = await axios.post(`https://api.usedevbook.com/v1/extensions/${extensionID}/entry/query`, {
    query,
    ...options.indexes,
  }, {
    params: {
      page: options.page || 10,
    },
  });
  return result.data;
}
