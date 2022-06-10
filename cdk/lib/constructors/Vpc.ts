import { SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";
import { StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

export class VpcStack {
  public readonly vpc: Vpc;
  constructor(scope: Construct, props: StackProps) {
    // VPC
    this.vpc = new Vpc(scope, 'MyVPC', { 
      cidr: '10.0.0.0/16',
      maxAzs: 2,
      natGateways: 2,
      subnetConfiguration: [ 
        { name: 'AlbPublic_', subnetType: SubnetType.PUBLIC },
        { name: 'EcsPrivate_', subnetType: SubnetType.PRIVATE_WITH_NAT },
        { name: 'AuroraIsolated_', subnetType: SubnetType.PRIVATE_ISOLATED }
      ]
    });
  }
}
