import ExtensionProcess from './ExtensionProcess';

export * from './event';
export * from './message';
export * from './source';
export * from './status';
export { ExtensionEventHandlers } from './ExtensionModuleHandler';

export default require.main === module && new ExtensionProcess();
