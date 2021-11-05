import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic

export class TodosAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE
    ) { }

    async getAllTodoItems(userId: string): Promise<TodoItem[]> {
        logger.info(`Getting all TodoItem for user with ID: ${userId}`);

        const result = await this.docClient.query({
            TableName: this.todosTable,
            IndexName: 'CreatedAtIndex',
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            },

        }).promise()

        return result.Items as TodoItem[]
    }

    async createTodoItem(todoItem: TodoItem): Promise<TodoItem> {
        logger.info(`Creating TodoItem with id ${todoItem.todoId}`);
        await this.docClient.put({
            TableName: this.todosTable,
            Item: todoItem,
        }).promise()

        return todoItem
    }

    async updateTodoItem(userId: string, todoUpdate: TodoUpdate, todoId: string): Promise<TodoUpdate> {
        logger.info(`Updating TodoItem with id ${todoId}`);

        await this.docClient.update({
            TableName: this.todosTable,
            Key: { todoId: todoId, userId: userId },
            UpdateExpression: "set #name=:name, dueDate=:dueDate, done=:done",
            ExpressionAttributeNames: { "#name": "name" },
            ExpressionAttributeValues: {
                ":name": todoUpdate.name,
                ":dueDate": todoUpdate.dueDate,
                ":done": todoUpdate.done
            },
        }).promise()

        return todoUpdate

    }

    async deleteTodoItem(userId: string, todoId: string) {
        logger.info(`Deleting TodoItem with id ${todoId}`);

        await this.docClient.delete({
            TableName: this.todosTable,
            Key: { todoId: todoId, userId: userId }
        }).promise()

    }

}