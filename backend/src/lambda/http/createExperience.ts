import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateExperienceRequest } from '../../requests/CreateExperienceRequest'
import { getUserId } from '../utils';
import { createExperience } from '../../helpers/experiences'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newExperience: CreateExperienceRequest = JSON.parse(event.body)
    const userId = getUserId(event)
    const item = await createExperience(userId, newExperience)
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        item
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
