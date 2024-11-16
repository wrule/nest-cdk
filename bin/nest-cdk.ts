#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { NestCdkStack } from '../lib/nest-cdk-stack';

const app = new cdk.App();
new NestCdkStack(app, 'NestCdkStack');
