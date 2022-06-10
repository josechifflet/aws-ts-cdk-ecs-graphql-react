/* eslint-disable no-console */
import chalk from 'chalk';

export const debug = (data: any): void => {
  typeof data === 'object'
    ? console.debug(chalk.hex('ffa500')(`🐛 [Debug]: ${   JSON.stringify(data, null, 2)}`))
    : console.debug(chalk.hex('ffa500')(`🐛 [Debug]: ${  data?.toString()}`));
};

export const log = (data: any): void => {
  console.log(data)
};

export const logInfo = (data: any, processName?: string): void => {
  typeof data === 'object'
    ? console.log(chalk.white(`ℹ️  [${processName || "INFO"}]: ${  JSON.stringify(data, null, 2)}`))
    : console.log(chalk.white(`ℹ️  [${processName || "INFO"}]: ${  data?.toString()}`));
};

export const logTitle = (title: string): void => console.log(chalk.blueBright(`👉 ${title}`))

export const logSuccess = (data: any, processName?: string): void => {
  typeof data === 'object'
    ? console.info(chalk.greenBright(`✅ [${processName || "SUCCESS"}]: ${  JSON.stringify(data, null, 2)}`))
    : console.info(chalk.greenBright(`✅ [${processName || "SUCCESS"}]: ${  data?.toString()}`));
};

export const logWarning = (data: any, processName?: string): void => {
  typeof data === 'object'
    ? console.warn(chalk.yellowBright(`⚠️ [${processName || "WARNING"}]: ${  JSON.stringify(data, null, 2)}`))
    : console.warn(chalk.yellowBright(`⚠️ [${processName}]: ${  data?.toString()}`));
};

export const logError = (data: any, processName?: string): void => {
  if (data.stack) {
    console.error(chalk.redBright(`❌ [${processName || "ERROR"}]: ${  data.stack?.toString()}`));
  } else if (typeof data === 'object') {
    console.error(chalk.redBright(`❌ [${processName || "ERROR"}]: ${  JSON.stringify(data, null, 2)}`));
  } else {
    console.error(chalk.redBright(`❌ [${processName || "ERROR"}]: ${  data?.toString()}`));
  }
};
