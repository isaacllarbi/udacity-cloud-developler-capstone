import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
const XAWS = AWSXRay.captureAWS(AWS)

export class AttachmentUtils {
    constructor(
        private readonly s3 = new XAWS.S3({ signatureVersion: "v4" }),
        private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
        private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION,
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly experiencesTable = process.env.EXPERIENCES_TABLE
    ) { }

    async getSignedUrl(experienceId: string, userId: string): Promise<string> {
        const uploadurl = this.s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: experienceId,
            Expires: parseInt(this.urlExpiration)
        })

        await this.docClient.update({
            TableName: this.experiencesTable,
            Key: { userId: userId, experienceId: experienceId },
            UpdateExpression: "set attachmentUrl=:url",
            ExpressionAttributeValues: {
                ":url": `https://${this.bucketName}.s3.amazonaws.com/${experienceId}`
            },
        }).promise()

        return uploadurl

    }
}