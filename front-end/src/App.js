import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import './App.css';
import * as routes from './utility/routes';
import Index from './home/index';
import Login from './login/login';
import Credential from './credential/credential';
import Signup from './signup/signup';
import Dashboard from './dashboard/dashboard';
import ProtectedRoute from './utility/protectedRoute';
import Message from './utility/message';
import Credentials from './credential/credentials';
import Teams from './team/teams';
import AddTeam from './team/addTeam';
import EditProfile from './editProfile/editProfile';

import jwt_decode from 'jwt-decode';
import { connect } from 'react-redux';
import * as actions from './store/actions';

class App extends Component {
  componentDidMount = () => {
    if (localStorage.jwtToken) {
      const decoded = jwt_decode(localStorage.jwtToken);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        localStorage.removeItem('jwtToken')
      } else {
        this.props.logUserIn(localStorage.jwtToken, decoded)
      }
    }
  }

  render(){
    return (
      <BrowserRouter>
        <Message>

          <Switch>

            <Route path={routes.LOGIN}>
              <Login></Login>
            </Route>
            <Route path={routes.SIGNUP}>
              <Signup></Signup>
            </Route>
            <Route path={routes.DASHBOARD}>
            <ProtectedRoute><Dashboard /></ProtectedRoute>
            </Route>
            <Route path={routes.ADD_CREDENTIAL}>
            <ProtectedRoute><Credential /></ProtectedRoute>
            </Route>
            <Route path={routes.CREDENTIALS}>
              <ProtectedRoute><Credentials /></ProtectedRoute>
            </Route>
            <Route path={routes.ADD_TEAM}>
              <ProtectedRoute><AddTeam /></ProtectedRoute>
            </Route>
            <Route path={routes.TEAMS}>
              <ProtectedRoute><Teams /></ProtectedRoute>
            </Route>

            <Route path={routes.EDIT_PROFILE}>
              <ProtectedRoute><EditProfile /></ProtectedRoute>
            </Route>

            <Route path={routes.INDEX}>
              <Index />
            </Route>

            <Redirect to={routes.LOGIN} />

          </Switch>

        </Message>

      </BrowserRouter>
    
    );
  
  }

}

const mapDispatchToProps = dispatch => {
  return {
    logUserIn: (auth_token, loggedUser) => dispatch({
      type: actions.LOGIN_WITH_SUCCESS,
      payload: {auth_token, loggedUser}
    })
  }
}
export default  connect(null, mapDispatchToProps)(App);
