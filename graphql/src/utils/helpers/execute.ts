import { exec } from "child_process";

export const execute = async (command: string) => new Promise((resolve, reject) => {
      exec(command, (err, stdout, stderr) => {
        err
          ? reject(err)
          : resolve({ stdout, stderr });
      })
    })