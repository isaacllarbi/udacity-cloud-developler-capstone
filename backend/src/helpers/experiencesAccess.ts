import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { ExperienceItem } from '../models/ExperienceItem'
import { ExperienceUpdate } from '../models/ExperienceUpdate'
const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('ExperiencesAccess')

export class ExperiencesAccess {
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly experiencesTable = process.env.EXPERIENCES_TABLE
  ) { }

  async getAllExperienceItems(userId: string): Promise<ExperienceItem[]> {
    logger.info(`Getting all ExperienceItem for user with ID: ${userId}`);

    const result = await this.docClient.query({
      TableName: this.experiencesTable,
      IndexName: 'CreatedAtIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },

    }).promise()

    return result.Items as ExperienceItem[]
  }

  async createExperienceItem(experienceItem: ExperienceItem): Promise<ExperienceItem> {
    logger.info(`Creating ExperienceItem with id ${experienceItem.experienceId}`);
    await this.docClient.put({
      TableName: this.experiencesTable,
      Item: experienceItem,
    }).promise()

    return experienceItem
  }

  async updateExperienceItem(userId: string,
    experienceUpdate: ExperienceUpdate,
    experienceId: string): Promise<ExperienceUpdate> {
    logger.info(`Updating ExperienceItem with id ${experienceId}`);

    await this.docClient.update({
      TableName: this.experiencesTable,
      Key: { experienceId: experienceId, userId: userId },
      UpdateExpression: "set #foodDetails=:foodDetails, location=:location, review=:review",
      ExpressionAttributeNames: { "#foodDetails": "foodDetails" },
      ExpressionAttributeValues: {
        ":foodDetails": experienceUpdate.foodDetails,
        ":location": experienceUpdate.location,
        ":review": experienceUpdate.review
      },
    }).promise()

    return experienceUpdate
  }

  async deleteExperienceItem(userId: string, experienceId: string) {
    logger.info(`Deleting ExperienceItem with id ${experienceId}`);

    await this.docClient.delete({
      TableName: this.experiencesTable,
      Key: { experienceId: experienceId, userId: userId }
    }).promise()

  }

}