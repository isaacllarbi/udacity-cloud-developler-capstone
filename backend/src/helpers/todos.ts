import { TodosAccess } from './todosAcess'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import * as uuid from 'uuid'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
// import { createLogger } from '../utils/logger'
import { AttachmentUtils } from './attachmentUtils';
import { TodoUpdate } from '../models/TodoUpdate';
// import * as createError from 'http-errors'

// DONE: Implement businessLogic
const todosAccess = new TodosAccess();
const attachmentUtils = new AttachmentUtils();

export async function getTodosForUser(userId: string) {
    return todosAccess.getAllTodoItems(userId)
}

export async function createTodo(userId: string, createTodoRequest: CreateTodoRequest) {
    //reject user who has created 10 on trial
    //count number todoItems created
    //
    const itemId = uuid.v4()
    const todoItem: TodoItem = {
        userId: userId,
        todoId: itemId,
        createdAt: new Date().toISOString(),
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        done: false
    }

    return await todosAccess.createTodoItem(todoItem)
}

export async function updateTodo(userId: string, updateTodoRequest: UpdateTodoRequest, todoId: string): Promise<TodoUpdate> {
    const todoUpdate: TodoUpdate = {
        name: updateTodoRequest.name,
        done: updateTodoRequest.done,
        dueDate: updateTodoRequest.dueDate
    }
    return await todosAccess.updateTodoItem(userId, todoUpdate, todoId)
}

export async function deleteTodo(userId: string, todoId: string) {
    return await todosAccess.deleteTodoItem(userId, todoId)
}

export async function createAttachmentPresignedUrl(todoId: string, userId: string): Promise<string> {
    const url = await attachmentUtils.getSignedUrl(todoId, userId);

    return url
}
