
// example logger which will be replaced with pino
export const logger = {
    info: (...args: any) => {
        console.log(`INFO:`, ...args);
    },
    debug: (...args: any) => {
        console.debug(`DEBUG:`, ...args);
    },
    error: (...args: any) => {
        console.error(`ERROR:`, ...args);
    },
    warn: (...args: any) => {
        console.warn(`WARN:`, ...args);
    }
}