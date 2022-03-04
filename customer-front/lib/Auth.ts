import { withAuthenticator } from 'aws-amplify-react'
import Amplify from 'aws-amplify'

Amplify.configure({
  Auth: {
    region: 'us-east-1',
    userPoolId: 'us-east-1_CHqVOzMaq',
    userPoolWebClientId: '7gt4jnsr9j0ni348omp9c6troo',
  },
})

export const withAuthCheck = withAuthenticator
