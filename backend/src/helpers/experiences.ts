import { ExperiencesAccess } from './experiencesAccess'
import { ExperienceItem } from '../models/ExperienceItem'
import { CreateExperienceRequest } from '../requests/CreateExperienceRequest'
import * as uuid from 'uuid'
import { UpdateExperienceRequest } from '../requests/UpdateExperienceRequest';
// import { createLogger } from '../utils/logger'
import { AttachmentUtils } from './attachmentUtils';
import { ExperienceUpdate } from '../models/ExperienceUpdate';
// import * as createError from 'http-errors'

// DONE: Implement businessLogic
const experiencesAccess = new ExperiencesAccess();
const attachmentUtils = new AttachmentUtils();

export async function getExperiencesForUser(userId: string) {
  return experiencesAccess.getAllExperienceItems(userId)
}

export async function createExperience(userId: string, createExperienceRequest: CreateExperienceRequest) {
  //reject user who has created 10 on trial

  const itemId = uuid.v4()
  const experienceItem: ExperienceItem = {
    userId: userId,
    experienceId: itemId,
    createdAt: new Date().toISOString(),
    foodDetails: createExperienceRequest.foodDetails,
    location: createExperienceRequest.location,
    review: createExperienceRequest.review
  }

  return await experiencesAccess.createExperienceItem(experienceItem)
}

export async function updateExperience(userId: string,
  updateExperienceRequest: UpdateExperienceRequest,
  experienceId: string): Promise<ExperienceUpdate> {
  const experienceUpdate: ExperienceUpdate = {
    foodDetails: updateExperienceRequest.foodDetails,
    location: updateExperienceRequest.location,
    review: updateExperienceRequest.review
  }
  return await experiencesAccess.updateExperienceItem(userId, experienceUpdate, experienceId)
}

export async function deleteExperience(userId: string, experienceId: string) {
  return await experiencesAccess.deleteExperienceItem(userId, experienceId)
}

export async function createAttachmentPresignedUrl(experienceId: string,
  userId: string): Promise<string> {
  const url = await attachmentUtils.getSignedUrl(experienceId, userId);

  return url
}
