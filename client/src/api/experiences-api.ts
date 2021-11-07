import { apiEndpoint } from '../config'
import { Experience } from '../types/Experience';
import {  CreateExperienceRequest } from '../types/CreateExperienceRequest';
import Axios from 'axios'
import { UpdateExperienceRequest } from '../types/UpdateExperienceRequest';

export async function getExperiences(idToken: string): Promise<Experience[]> {
  console.log('Fetching experiences')

  const response = await Axios.get(`${apiEndpoint}/experiences`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Experiences:', response.data)
  return response.data.items
}

export async function createExperience(
  idToken: string,
  newExperience: CreateExperienceRequest
): Promise<Experience> {
  console.log('Create Experience',newExperience)

  const response = await Axios.post(`${apiEndpoint}/experiences`,  JSON.stringify(newExperience), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })

  return response.data.item
}

export async function patchExperience(
  idToken: string,
  experienceId: string,
  updatedExperience: UpdateExperienceRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/experiences/${experienceId}`, JSON.stringify(updatedExperience), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteExperience(
  idToken: string,
  experienceId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/experiences/${experienceId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  experienceId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/experiences/${experienceId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
