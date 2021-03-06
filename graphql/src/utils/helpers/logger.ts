/* eslint-disable no-console */
import chalk from 'chalk';

export const debug = (data: any): void => {
  typeof data === 'object'
    ? console.debug(chalk.hex('ffa500')(`đ [Debug]: ${   JSON.stringify(data, null, 2)}`))
    : console.debug(chalk.hex('ffa500')(`đ [Debug]: ${  data?.toString()}`));
};

export const log = (data: any): void => {
  console.log(data)
};

export const logInfo = (data: any, processName?: string): void => {
  typeof data === 'object'
    ? console.log(chalk.white(`âšī¸  [${processName || "INFO"}]: ${  JSON.stringify(data, null, 2)}`))
    : console.log(chalk.white(`âšī¸  [${processName || "INFO"}]: ${  data?.toString()}`));
};

export const logTitle = (title: string): void => console.log(chalk.blueBright(`đ ${title}`))

export const logSuccess = (data: any, processName?: string): void => {
  typeof data === 'object'
    ? console.info(chalk.greenBright(`â [${processName || "SUCCESS"}]: ${  JSON.stringify(data, null, 2)}`))
    : console.info(chalk.greenBright(`â [${processName || "SUCCESS"}]: ${  data?.toString()}`));
};

export const logWarning = (data: any, processName?: string): void => {
  typeof data === 'object'
    ? console.warn(chalk.yellowBright(`â ī¸ [${processName || "WARNING"}]: ${  JSON.stringify(data, null, 2)}`))
    : console.warn(chalk.yellowBright(`â ī¸ [${processName}]: ${  data?.toString()}`));
};

export const logError = (data: any, processName?: string): void => {
  if (data.stack) {
    console.error(chalk.redBright(`â [${processName || "ERROR"}]: ${  data.stack?.toString()}`));
  } else if (typeof data === 'object') {
    console.error(chalk.redBright(`â [${processName || "ERROR"}]: ${  JSON.stringify(data, null, 2)}`));
  } else {
    console.error(chalk.redBright(`â [${processName || "ERROR"}]: ${  data?.toString()}`));
  }
};
