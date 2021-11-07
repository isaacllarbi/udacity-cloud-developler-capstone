import * as React from 'react'
import Auth from '../auth/Auth'
import { Button } from 'semantic-ui-react'

interface LogInProps {
  auth: Auth
}

interface LogInState { }

export class LogIn extends React.PureComponent<LogInProps, LogInState> {
  onLogin = () => {
    this.props.auth.login()
  }

  render() {
    return (
      <div>
        <h1>Welcome to Foodie</h1>
        <h4>
          🧅🍄🥜🌰🍞🥐🫓🥨🥯🥞
          🧇🥖🧀🍖 🍗🥩 🍟🌭🥓🍔🍕🥪🌮</h4>
        <h3>Please log in</h3>

        <Button onClick={this.onLogin} size="huge" color="olive">
          Log in
        </Button>
      </div>
    )
  }
}
