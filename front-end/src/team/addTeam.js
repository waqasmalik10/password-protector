import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import * as routes from './../utility/routes';
const axios = require('axios');

class AddTeam extends Component {
  state = {
    errorMessage: '',
    name: '',
    isError: false,
    isLoading: false,
  }
  
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }


  createTeam = e => {
    e?.preventDefault();
    this.setState({
      isLoading: true
    });
    if(this.state.name === '' || this.state.name === undefined) {
      alert('Please Enter Team Name')
      return
    }

    axios
        .post('http://localhost:8080/user/createTeam', {
          name: this.state.name
        }, {
            headers: {
                'Authorization': `Bearer ${this.props.auth_token}` 
            }
        })
        .then(res => {
          this.setState({
            isLoading: false
          });
            this.props.history.push(routes.TEAMS);
        })
        .catch(err => {
            console.log(err)
            this.setState({
              isLoading: false,
              isError: true,
              errorMessage: err?.response?.data?.message || err.message
            });
        });
    
  }
    render(){
        return (
            <div className="min-h-screen bg-white flex">
              <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                  <div>
                    <img
                      className="h-12 w-auto"
                      src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                      alt="Workflow"
                    />
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create Team</h2>
                  </div>
                  <div className="mt-8">
                    <div>
                      <div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <form action="#" method="POST" className="space-y-6">
                      <div>
                          <label htmlFor="credential" className="block text-sm font-medium text-gray-700">
                            Team Name
                          </label>
                          <div className="mt-1">
                            <input
                              id="name"
                              name="name"
                              type="text"
                              autoComplete="name"
                              required
                              value={this.state.name}
                              onChange={this.handleChange}
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <button
                            type="button"
                            onClick={this.createTeam}
                            disabled={this.state.isLoading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Create Team
                          </button>
                        </div>
                        {this.state.isError ? (
                          <p className="text-center text-red-500">{this.state.errorMessage}</p>
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
  export default connect(mapStatToProps)(withRouter(AddTeam));