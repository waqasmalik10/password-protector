import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import * as actions from '../store/actions';
import { Redirect, withRouter } from "react-router";
import * as routes from './../utility/routes';

class Login extends Component {
  state = {
    email: '',
    password: ''
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  login = e => {
    e.preventDefault();
    this.props.login(this.state.email, this.state.password, this.props.history);
  }
    render(){
        return this.props.isAuthenticated ? (<Redirect to={routes.DASHBOARD} />) :(
            <div className="min-h-screen bg-white flex">
              <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                  <div>
                    <img
                      className="h-12 w-auto"
                      src="images/logos/workflow-mark-indigo-600.svg"
                      alt="Workflow"
                    />
                  </div>
                  <div className="mt-8">
                    <div>
                      <div>
                      </div>
                    </div>
                    <div className="mt-6">

                      <Link to={routes.LOGIN} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          Sign In
                      </Link>

                      <br />

                      <Link to={routes.SIGNUP} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          Sign Up
                      </Link>

                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block relative w-0 flex-1">
                <img
                  className="absolute inset-0 h-full w-full object-cover"
                  src="https://images.unsplash.com/photo-1505904267569-f02eaeb45a4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
                  alt=""
                />
              </div>
            </div>
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
      login: (email, password, history) => dispatch(actions.login({email, password, history}))
    }
  }
  export default connect(mapStatToProps, mapDispatchToProps)(withRouter(Login));