import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../store/actions';
import { Redirect, withRouter } from "react-router";
import * as routes from './../utility/routes';
import { Link } from 'react-router-dom';

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
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
                  </div>
                  <div className="mt-8">
                    <div>
                      <div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <form action="#" method="POST" className="space-y-6">
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email address
                          </label>
                          <div className="mt-1">
                            <input
                              id="email"
                              name="email"
                              type="email"
                              autoComplete="email"
                              required
                              onChange={this.handleChange}
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                          </label>
                          <div className="mt-1">
                            <input
                              id="password"
                              name="password"
                              type="password"
                              autoComplete="current-password"
                              required
                              onChange={this.handleChange}
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <button
                            type="submit"
                            onClick={this.login}
                            disabled={this.props.isLoading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Sign in
                          </button>

                          <Link to={routes.SIGNUP}>Signup</Link>
                          
                        </div>
                        {this.props.isError ? (
                          <p className="text-center text-red-500">{this.props.errorMessage}</p>
                        ): null}
                      </form>
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