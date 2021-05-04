import React, { Component, Fragment } from "react";
import { Dialog, Transition } from '@headlessui/react';
import { CheckIcon, XIcon } from '@heroicons/react/outline';
import { connect } from 'react-redux';
import * as actions from '../store/actions';
import * as routes from './../utility/routes';
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { Link, Route, withRouter } from "react-router-dom";
import ShareCredential from './shareCredential';
const CryptoJS = require("crypto-js");

class Credentials extends Component{
    state = {
        showModal: false,
        secretKey: '',
        hash: '',
        showResult: false,
        result: ''
    }
    
    componentDidMount = () => {
        this.props.getAllCredentials();
    }

    handleChange = (e) => {
        this.setState({
          [e.target.name]: e.target.value
        })
      }
    
      handleModel = (hash) => {
        this.setState({showModal: !this.state.showModal, hash: hash})
      }
    
      closeDecryptModel = () => {
        this.setState({showModal: false})
      }

      closeResultModel = () => {
        this.setState({showResult: false})
      }
    decrypt = () => {
        var decrypted = CryptoJS.AES.decrypt(this.state.hash, this.state.secretKey);
        if(!decrypted){
            this.setState({
                hash: '',
                secretKey: '',
                result: '',
                showModal:false,
                showResult:true
            });
        }
        else{
            try{
                const result = decrypted.toString(CryptoJS.enc.Utf8)
                this.setState({
                    hash: '',
                    secretKey: '',
                    result: result,
                    showModal:false,
                    showResult:true
                });
            }
            catch(err){
                this.setState({
                    hash: '',
                    secretKey: '',
                    result: '',
                    showModal:false,
                    showResult:true
                });
            }
        }        
    }

    shareCredential = (credential) => {
        this.props.shareCredential(credential);
        this.props.history.push(routes.SHARE_CREDENTIAL)
    }
    render(){
        let body = null;
        if(this.props.isLoading){
            body = (<tr className='bg-white'>
                        <td colSpan="4" className="px-6 py-4 whitespace-nowrap text-sm self-center text-gray-500">
                            <Loader
                                type="TailSpin"
                                color="#00BFFF"
                                height={100}
                                width={100}
                                className="px-96 text-gray-500"
                            />
                        </td>
                    </tr>
            );
        }
        else if(this.props.credentials.length && !this.props.isError){
            body = this.props.credentials.map((data, dataIdx) => (
                            <tr key={data._id} className={dataIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dataIdx}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.credential}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button onClick={() => this.handleModel(data.credential)} className="text-indigo-600 hover:text-indigo-900">
                                go decrypt
                                </button>
                                <button onClick={() => this.shareCredential(data)} className="ml-2 text-indigo-600 hover:text-indigo-900">
                                Share
                                </button>
                            </td>
                            </tr>
                        ));
        }
        else if(this.props.isError){
            body = <tr className='bg-white'><td colSpan="4" className="px-6 py-4 whitespace-nowrap text-sm text-center text-red-500">{this.props.errorMessage}</td></tr>
        }
        else{
            body = <tr className='bg-white'><td colSpan="4" className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">No Results</td></tr>
        }


        return (
            <div className="overflow-hidden	bg-gray-100	p-8">
                <header className="flex flex-wrap md:flex-nowrap items-center mb-3 py-1.5 whitespace-nowrap">
                    <div className="min-w-0 flex items-center">
                        <h2 className="font-medium text-gray-900 truncate">
                        <a href="#component-d60e8c748260b622747ec1568ba9c509" className="mr-1">Credentials List</a>
                        </h2>
                    </div>
                    <div className="w-full flex-none md:w-auto md:pl-6 mt-1 md:mt-0 ml-auto text-teal-600 text-sm font-medium">
                        <Link to={routes.ADD_CREDENTIAL} className="hover:text-teal-800">
                            Add New →
                        </Link>
                    </div>
                </header>
                <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                ID
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Title
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Credential
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Get Original</span>
                            </th>
                            </tr>
                        </thead>
                        <tbody>
                                {body}
                        </tbody>
                        </table>
                    </div>
                    </div>
                </div>
                </div>

                <Transition.Root show={this.state.showModal} as={Fragment}>
                    <Dialog as="div" static className="fixed z-10 inset-0 overflow-y-auto" open={this.state.showModal} onClose={this.closeDecryptModel}>
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
                                    Enter your key to decryp your credential. We are not saving this key.
                                </p>
                                </div>
                            </div>
                        </div>
                            <div className="mt-5 sm:mt-6">
                            <button
                                type="button"
                                className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                onClick={this.decrypt}
                            >
                                Decrypt
                            </button>
                            </div>
                        </div>
                        </Transition.Child>
                    </div>
                    </Dialog>
                </Transition.Root>

                <Transition.Root show={this.state.showResult} as={Fragment}>
                    <Dialog as="div" static className="fixed z-10 inset-0 overflow-y-auto" open={this.state.showResult} onClose={this.closeResultModel}>
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
                            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                            <div>
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                {this.state.result ? <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" /> :  <XIcon className="h-6 w-6 text-red-600" aria-hidden="true" />}
                                </div>
                                <div className="mt-3 text-center sm:mt-5">
                                <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                    Decryption {this.state.result ? "successful" : "unsuccessful" }
                                </Dialog.Title>
                                <div className="mt-2">
                                    <pre className="text-sm text-gray-500" style={{padding: '10px'}}>
                                        {this.state.result}
                                    </pre>
                                </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-6">
                                <button
                                type="button"
                                className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                onClick={() => this.setState({showResult:false})}
                                >
                                Close
                                </button>
                            </div>
                            </div>
                        </Transition.Child>
                        </div>
                    </Dialog>
                    </Transition.Root>

                    <Route exact path={routes.SHARE_CREDENTIAL}>
                        <ShareCredential />
                    </Route>
            </div>
          )
    }credential
}

const mapStatToProps = state => {
    return {
      ...state
    }
  }
  const mapDispatchToProps = dispatch => {
    return {
      getAllCredentials: () => dispatch(actions.getAllCredentials()),
      shareCredential: (credential) => dispatch({
          type: actions.SHARE_CREDENTIAL,
          payload: { credential }
      })
    }
  }
  export default connect(mapStatToProps, mapDispatchToProps)(withRouter(Credentials));