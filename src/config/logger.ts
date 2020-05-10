const { createLogger, format, transports } = require('winston');
const fs = require('fs');
const path = require('path');

const env = process.env.NODE_ENV || 'development';
const logDir = 'logs';


// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const filename = path.join(logDir, 'results.log');

const getLabel = (callingModule: any) => {
    var parts = callingModule.filename.split(path.sep);
    return path.join('', parts.pop());
};

export function createLoggerWithModuleName(callingModule: any) {
    return createLogger({
        // change level if in dev environment versus production
        level: env === 'production' ? 'info' : 'debug',
        format: format.combine(
            format.label({ label: getLabel(callingModule) }),
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
        ),
        transports: [
            new transports.Console({
                format: format.combine(
                    format.colorize(),
                    format.printf(
                        (info: any) =>
                            `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
                    )
                )
            }),
            new transports.File({
                filename,
                format: format.combine(
                    format.printf(
                        (info: any) =>
                            `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
                    )
                )
            })
        ]
    });
};