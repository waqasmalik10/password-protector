import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../store/actions';
import { Dialog, Transition } from '@headlessui/react';
import { withRouter } from 'react-router';
const CryptoJS = require("crypto-js");

class Credential extends Component {
  state = {
    credential: '',
    title: '',
    secretKey: '',
    showModal: false,
  }
  
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleModel = () => {
    this.setState({showModal: !this.state.showModal})
  }

  closeModel = () => {
    this.setState({showModal: false})
  }

  saveCredential = e => {
    e?.preventDefault();
    this.setState({
      showModal: false
    });
    if(this.state.credential === '' || this.state.credential === undefined) {
      alert('Please Enter Credentilas')
      return
    }
    if(this.state.secretKey === '' || this.state.secretKey === undefined) {
      alert('Please Enter Secret Key')
      return
    }
    
    const encrypted = CryptoJS.AES.encrypt(this.state.credential, this.state.secretKey);
    const encryptedString = encrypted.toString();
    console.log("encrypted:", encrypted.toString());
    this.props.saveCredential(this.state.title, encryptedString, this.props.history);
    this.setState({
      credential: '',
      title: '',
      secretKey: '',
      showModal: false,
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
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Send Credential</h2>
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
                            Title
                          </label>
                          <div className="mt-1">
                            <input
                              id="title"
                              name="title"
                              type="text"
                              autoComplete="title"
                              required
                              value={this.state.title}
                              onChange={this.handleChange}
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="credential" className="block text-sm font-medium text-gray-700">
                            Credential
                          </label>
                          <div className="mt-1">
                            <textarea
                              id="credential"
                              name="credential"
                              type="text"
                              autoComplete="credential"
                              required
                              rows="5"
                              value={this.state.credential}
                              onChange={this.handleChange}
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <button
                            type="button"
                            onClick={this.handleModel}
                            disabled={this.props.isLoading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Save
                          </button>
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

              <Transition.Root show={this.state.showModal} as={Fragment}>
                <Dialog as="div" static className="fixed z-10 inset-0 overflow-y-auto" open={this.state.showModal} onClose={this.closeModel}>
                  <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>
                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                      &#8203;
                    </span>
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                      enterTo="opacity-100 translate-y-0 sm:scale-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                      leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                      <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                        <div>
                           <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                              Secret Key
                            </Dialog.Title>
                          <div className="mt-3 text-center sm:mt-5">
                          <div>
                            <div className="mt-1">
                              <input
                                id="secretKey"
                                name="secretKey"
                                type="text"
                                autoComplete="secretKey"
                                required
                                value={this.state.secretKey}
                                onChange={this.handleChange}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                            </div>
                          </div>
                            
                            <div className="mt-2">
                              <p className="text-sm text-gray-500">
                                Enter your key to encryp your data. We are not saving this key.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-5 sm:mt-6">
                          <button
                            type="button"
                            className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                            onClick={this.saveCredential}
                          >
                            Encryp and Save
                          </button>
                        </div>
                      </div>
                    </Transition.Child>
                  </div>
                </Dialog>
              </Transition.Root>
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
      saveCredential: (title, credential, history) => dispatch(actions.saveCredential({title, credential, history}))
    }
  }
  export default connect(mapStatToProps, mapDispatchToProps)(withRouter(Credential));