import { SecretValue, Stack, StackProps } from 'aws-cdk-lib';
import * as amplify from 'aws-cdk-lib/aws-amplify';
import { BuildSpec } from 'aws-cdk-lib/aws-codebuild';
import { Construct } from 'constructs';

export class NestCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const buildSpec = BuildSpec.fromObject({
      version: 1,
      applications: [{
        frontend: {
          phases: {
            build: {
              commands: ['npm ci', 'npm run build']
            }
          },
          artifacts: {
            baseDirectory: '.next',
            files: ['**/*']
          },
          cache: {
            paths: ['node_modules/**/*']
          }
        }
      }]
    });

    const app = new amplify.CfnApp(this, 'AmplifyApp', {
      name: 'next-cdk',
      repository: 'https://github.com/wrule/next-cdk.git',
      accessToken: SecretValue.unsafePlainText('github_token').toString(),
      buildSpec: buildSpec.toString(),
    });

    new amplify.CfnBranch(this, 'MainBranch', {
      appId: app.attrAppId,
      branchName: 'main',
    });
  }
}
