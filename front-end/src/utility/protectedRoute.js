import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from "react-router";
import Header from './header';
import * as actions from '../store/actions';

class ProtectedRoute extends Component {
  
    render(){
        return (
            !this.props.isAuthenticated ?  <Redirect to='/login' /> : (
                <React.Fragment>
                    <Header logout={this.props.logout}></Header>
                    {this.props.children}
                </React.Fragment>
            )
        )
    }
  }

  const mapStatToProps = state => {
    return {
      ...state
    }
  }

  const mapDispatchToProps = dispatch => {
    return {
      logout: () => dispatch(actions.logout())
    }
  }
  export default connect(mapStatToProps, mapDispatchToProps)(withRouter(ProtectedRoute));