type LogLevel = 'info' | 'error' | 'debug';

const formatMessage = (level: LogLevel, message: string, data?: any) => {
    const emoji = {
        info: 'ℹ️',
        error: '❌',
        debug: '🔍',
    }[level];

    const timestamp = new Date().toISOString();
    const dataString = data ? `\n${JSON.stringify(data, null, 2)}` : '';
    
    return `${emoji} [${timestamp}] ${message}${dataString}`;
};

export const logger = {
    info: (message: string, data?: any) => {
        console.log(formatMessage('info', message, data));
    },
    error: (message: string, error?: any) => {
        console.error(formatMessage('error', message, error));
    },
    debug: (message: string, data?: any) => {
        console.debug(formatMessage('debug', message, data));
    }
}; 