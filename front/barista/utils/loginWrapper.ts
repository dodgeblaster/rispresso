import { withAuthenticator } from 'aws-amplify-react'
import Amplify from 'aws-amplify'

Amplify.configure({
  aws_cognito_region: process.env.NEXT_PUBLIC_REGION,
  aws_user_pools_id: process.env.NEXT_PUBLIC_USERPOOL_ID,
  aws_user_pools_web_client_id: process.env.NEXT_PUBLIC_USERPOOL_CLIENT_ID,
})

export default withAuthenticator
