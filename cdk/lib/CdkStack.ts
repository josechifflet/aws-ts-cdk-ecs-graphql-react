import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Cloudfront } from "./constructors/Cloudfront";
import { Fargate } from "./constructors/Fargate";
import { Rds } from "./constructors/Rds";
import { VpcStack } from "./constructors/Vpc";
import { configEnvironment } from "./utils/config";


export class DemoStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    configEnvironment.loadConfig();

    const Vpc = new VpcStack(this, {
        ...props,
      });
      
      const db = new Rds(this, {
        vpc: Vpc.vpc
      });
      
      const backend = new Fargate(this, {
        ...props,
        vpc: Vpc.vpc,
        dbHost: db.databaseHost,
        dbPassword: db.databasePassword,
        dbUser: db.databaseUsername
      });
      
      new Cloudfront(this, {
        ...props,
        albEndpoint: backend.backendService.loadBalancer.loadBalancerDnsName,
      });
      
  }
}
