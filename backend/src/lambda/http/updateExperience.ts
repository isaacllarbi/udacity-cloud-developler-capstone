import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateExperience } from '../../helpers/experiences'
import { UpdateExperienceRequest } from '../../requests/UpdateExperienceRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const experienceId = event.pathParameters.experienceId
    const userId = getUserId(event)
    const updatedExperience: UpdateExperienceRequest = JSON.parse(event.body)
    await updateExperience(userId, updatedExperience, experienceId)

    return {
      statusCode: 200,
      body: JSON.stringify({})
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
