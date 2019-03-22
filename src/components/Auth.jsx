import React, { Component } from 'react';
import { Nav, Button, NavbarBrand } from 'react-bootstrap';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

export class Auth extends Component {
  constructor() {
    super();
    this.state = {
      logged: 0
    };
  }

  componentDidMount() {
    if (!localStorage.expired) return;
    const now = new Date() * 1;
    if (now < parseInt(localStorage.expired)) {
      this.setState({
        logged: 1
      });
    } else {
      localStorage.clear();
    }
  }

  facebookResponse = res => {
    // Successfully Logged In
    if (res && res.name && res.accessToken) {
      localStorage.name = res.name;
      localStorage.expired = new Date() * 1 + res.expiresIn * 1000;
      localStorage.id = res.id;
      localStorage.accessToken = res.accessToken;
      localStorage.logged = 1;
      this.setState({
        logged: 1
      });
    }
  };

  render() {
    return this.state.logged ? (
      <NavbarBrand>{localStorage.name}</NavbarBrand>
    ) : (
      <Nav>
        <FacebookLogin
          appId='317151258877538'
          autoLoad={false}
          callback={this.facebookResponse}
          render={renderProps => (
            <Button variant='primary' size='sm' onClick={renderProps.onClick}>
              Login with Facebook
            </Button>
          )}
        />
      </Nav>
    );
  }
}

export default Auth;
