import ExtensionProcess from './ExtensionProcess';

export * from './types';
export default require.main === module && new ExtensionProcess();
