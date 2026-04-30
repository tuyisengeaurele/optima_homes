const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
}

const timestamp = () => new Date().toISOString().slice(11, 19)

export const logger = {
  info: (msg, ...args) => console.log(`${colors.blue}[${timestamp()}] INFO${colors.reset} ${msg}`, ...args),
  success: (msg, ...args) => console.log(`${colors.green}[${timestamp()}] ✓${colors.reset} ${msg}`, ...args),
  warn: (msg, ...args) => console.warn(`${colors.yellow}[${timestamp()}] WARN${colors.reset} ${msg}`, ...args),
  error: (msg, ...args) => console.error(`${colors.red}[${timestamp()}] ERROR${colors.reset} ${msg}`, ...args),
  debug: (msg, ...args) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`${colors.gray}[${timestamp()}] DEBUG${colors.reset} ${msg}`, ...args)
    }
  },
}
