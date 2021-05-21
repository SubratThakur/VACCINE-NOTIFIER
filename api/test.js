import { createLogger } from '@sfdocs-internal/logger';

//For test run logger statements are not getting printed and that's why we are using console
const logger = createLogger({ label: 'cli' });

logger.info("test info");
logger.warn("warn");
logger.error("Error");