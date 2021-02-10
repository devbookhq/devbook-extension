import ExtensionProcess from './ExtensionProcess';

export * from './event';
export * from './message';
export * from './source';
export * from './status';
export * as extensionEndpoints from './extensionEndpoints';
export { ExtensionEventHandlers } from './ExtensionModuleHandler';

export default require.main === module && new ExtensionProcess();
