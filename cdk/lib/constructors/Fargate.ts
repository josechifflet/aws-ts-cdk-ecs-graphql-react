import { Vpc } from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecs_patterns from "aws-cdk-lib/aws-ecs-patterns";
import { ApplicationLoadBalancedFargateService } from "aws-cdk-lib/aws-ecs-patterns";
import { Cluster } from "aws-cdk-lib/aws-ecs";
import { Duration, RemovalPolicy, StackProps, SymlinkFollowMode } from "aws-cdk-lib";
import * as rds from "aws-cdk-lib/aws-rds";
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";
import { config } from "../utils/config";

interface CustomStackProps extends StackProps {
  vpc: Vpc;
  dbHost: rds.Endpoint;
  dbUser: string;
  dbPassword: string;
}

export class Fargate {
  public readonly backendService: ApplicationLoadBalancedFargateService;
  public readonly ecsCluster: Cluster;
  constructor(scope: Construct, props: CustomStackProps) {

    const { vpc, dbHost, dbUser, dbPassword } = props;

    // Fargate cluster
    this.ecsCluster = new ecs.Cluster(scope, "ecsCluster", {
      vpc: vpc as any,
    });


    const fargateLog = new LogGroup(scope, `${props.stackName}-logs`, {
      logGroupName: `${config.PROJECT_NAME}-logs`,
      retention: RetentionDays.THREE_MONTHS,
      removalPolicy: RemovalPolicy.DESTROY
  });


    // Fargate service
    this.backendService =
      new ecs_patterns.ApplicationLoadBalancedFargateService(
        scope,
        "backendService",
        {
          cluster: this.ecsCluster,
          memoryLimitMiB: 1024,
          cpu: 256,
          desiredCount: 1,
          taskImageOptions: {
            image: ecs.ContainerImage.fromAsset("../graphql/", {
              followSymlinks: SymlinkFollowMode.ALWAYS,
            }),
            containerPort: +config.API_PORT,
            environment: {
              ...process.env,
              DB_HOST: dbHost.hostname,
              DB_USER: dbUser,
              POSTGRES_PASSWORD: dbPassword,
              IS_REMOTE_ENV: "true"
            },
            logDriver: ecs.LogDrivers.awsLogs({
              streamPrefix: `${config.PROJECT_NAME}-logStream`,
              logGroup: fargateLog,
            }),
          },
        }
      );

    const scalableTarget = this.backendService.service.autoScaleTaskCount({
      maxCapacity: 3
    })

    scalableTarget.scaleOnCpuUtilization("CPUScaleUP", {
      targetUtilizationPercent: 80,
      scaleInCooldown: Duration.minutes(5),
      scaleOutCooldown: Duration.minutes(10)
    })

    scalableTarget.scaleOnMemoryUtilization('MemoryScaling', {
      targetUtilizationPercent: 70,
      scaleInCooldown: Duration.minutes(15),
      scaleOutCooldown: Duration.minutes(30)
    });

    // Health check
    this.backendService.targetGroup.configureHealthCheck({
      path: "/healthz",
      healthyThresholdCount: 3,
      unhealthyThresholdCount: 3,
      interval: Duration.seconds(60)
    });
  }
}
