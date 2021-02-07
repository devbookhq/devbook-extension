import ExtensionProcess from './ExtensionProcess';

export * from './call';
export * from './message';
export * from './source';
export * from './status';
export { ExtensionExports } from './ExtensionModuleHandler';

export default require.main === module && new ExtensionProcess();
