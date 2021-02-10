import ExtensionProcess from './ExtensionProcess';

export * from './event';
export * from './message';
export * from './source';
export * from './status';
export { ExtensionEventHandlers } from './ExtensionModuleHandler';

const extensionProcess = require.main === module && new ExtensionProcess();

import Devbook from './Devbook';
export default Devbook;
