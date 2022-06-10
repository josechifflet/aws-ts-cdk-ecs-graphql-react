#!/usr/bin/env node
import "source-map-support/register";
import { App } from "@aws-cdk/core";

import { DemoStack } from "../lib/CdkStack";
import { config } from "../config";

const app = new App();

new DemoStack(app, "CdkDemoApp", {
  env: { account: config.account, region: config.region },
});