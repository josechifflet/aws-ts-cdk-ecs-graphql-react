import { Vpc, SecurityGroup, Port } from "aws-cdk-lib/aws-ec2";
import { Duration, RemovalPolicy, StackProps } from "aws-cdk-lib";
import * as rds from "aws-cdk-lib/aws-rds";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import secretsManager = require("aws-cdk-lib/aws-secretsmanager");
import { Construct } from "constructs";
import { config } from "../utils/config";

interface CustomStackProps extends StackProps {
  vpc: Vpc;
}

export class Rds {
  public readonly databaseHost: rds.Endpoint;
  public readonly databaseUsername: string;
  public readonly databasePassword: string;

  constructor(scope: Construct, props: CustomStackProps) {

    const {vpc} = props;

    const databaseCredentialsSecret = new secretsManager.Secret(
      scope,
      "DBCredentialsSecret",
      {
        secretName: `demo-${config.ENVIRONMENT}-credentials`,
        description: "Credentials to access Wordpress MYSQL Database on RDS",
        generateSecretString: {
          secretStringTemplate: JSON.stringify({ username: config.DB_USER }),
          excludePunctuation: true,
          includeSpace: false,
          generateStringKey: "password",
        },
      }
    );

    const dbClusterSecurityGroup = new SecurityGroup(
      scope,
      "DBClusterSecurityGroup",
      { vpc }
    );
    dbClusterSecurityGroup.addIngressRule(
      ec2.Peer.ipv4(vpc.vpcCidrBlock),
      Port.tcp(+config.DB_PORT)
    );

    const rdsCluster = new rds.ServerlessCluster(scope, "Database", {
      engine: rds.DatabaseClusterEngine.auroraPostgres({
        version: rds.AuroraPostgresEngineVersion.VER_10_14,
      }),
      credentials: rds.Credentials.fromSecret(databaseCredentialsSecret),
      defaultDatabaseName: config.DB_NAME,
      vpc: vpc,
      securityGroups: [dbClusterSecurityGroup],
      deletionProtection: false,
      removalPolicy: RemovalPolicy.DESTROY,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED
      },
      scaling: {
        autoPause: Duration.hours(3),
        maxCapacity: 4,
        minCapacity: 2,
      },
    });

    this.databaseHost = rdsCluster.clusterEndpoint;
    this.databaseUsername = databaseCredentialsSecret
      .secretValueFromJson("username")
      .toString();
    this.databasePassword = databaseCredentialsSecret
      .secretValueFromJson("password")
      .toString();
  }
}