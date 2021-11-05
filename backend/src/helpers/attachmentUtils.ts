import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
const XAWS = AWSXRay.captureAWS(AWS)

// DONE: Implement the fileStogare logic
export class AttachmentUtils {
    constructor(
        private readonly s3 = new XAWS.S3({ signatureVersion: "v4" }),
        private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
        private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION,
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE
    ) { }

    async getSignedUrl(todoId: string, userId: string): Promise<string> {
        const uploadurl = this.s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: todoId,
            Expires: parseInt(this.urlExpiration)
        })

        await this.docClient.update({
            TableName: this.todosTable,
            Key: { userId: userId, todoId: todoId },
            UpdateExpression: "set attachmentUrl=:url",
            ExpressionAttributeValues: {
                ":url": `https://${this.bucketName}.s3.amazonaws.com/${todoId}`
            },
        }).promise()

        return uploadurl

    }
}