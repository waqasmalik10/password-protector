import React, { Component, Fragment } from "react";
import { Dialog, Transition } from '@headlessui/react';
import { CheckIcon, XIcon } from '@heroicons/react/outline';
import { connect } from 'react-redux';
import * as actions from '../store/actions';
import * as routes from './../utility/routes';
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { Link, withRouter } from "react-router-dom";
import MultiSelect from "react-multi-select-component";
const CryptoJS = require("crypto-js");
const axios = require('axios');

class ShareCredential extends Component {
    componentDidMount = () => {
        this.props.getAllTeams();
        let users = [{ label: "No Team Member", value: "", disabled: true }]
        if(this.props.teams.length){
            users = this.props.teams[0].members.map(m => {
                return { label: m.full_name, value: m.id }
            });

            this.setState({ users });
        }
    }

    state = {
        isLoading: false,
        isError: false,
        secretKey: '',
        newsecretKey: '',
        selectedUser: [],
        showModal: true,
        result: '',
        showResult:false,
        team: '',
        users: [{ label: "No Team Member", value: "", disabled: true }]
    }

    handleChange = (e) => {
        this.setState({
          [e.target.name]: e.target.value
        });

        if(e.target.name === 'team'){
            const selectedTeam = this.props.teams.find(t => t.id === e.target.value )
            const users = selectedTeam.members.map(m => {
                return { label: m.full_name, value: m.id }
            });

            this.setState({
                users
            });
        }
    }

    closeModel = () => {
        this.setState({showModal: false, showResult: false})
        this.props.history.push(routes.CREDENTIALS);
    }

    handleSelectedUser = (e) => {
        this.setState({selectedUser:e})
        console.log("select event:", e)
    }

    share = () => {
        if(this.state.secretKey === '' || this.state.secretKey === undefined) {
            alert('Please Enter Secret Key')
            return
        }
        if(this.state.newsecretKey === '' || this.state.newsecretKey === undefined) {
            alert('Please Enter New Secret Key')
            return
        }
        if(this.state.team === '' || this.state.team === undefined) {
            alert('Please Select team and its members to whom you wanna share')
            return
        }
        if(!this.state.selectedUser.length) {
            alert('Please Select at least one member')
            return
        }
        this.setState({
            isLoading: true
        });
        var decrypted = CryptoJS.AES.decrypt(this.props.credentialToShare.credential, this.state.secretKey);
        console.log(decrypted)
        if(!decrypted){
            this.setState({
                isLoading: false,
                isError: true,
                secretKey: '',
                result: 'Invalid Key',
                showModal:false,
                showResult:true
            });
        }
        else{
            try{
                const result = decrypted.toString(CryptoJS.enc.Utf8);
                console.log("decrupt result:", result)
                if(result === '' || result === undefined){
                    this.setState({
                        isLoading: false,
                        isError: true,
                        secretKey: '',
                        result: 'Invalid Key',
                        showModal:false,
                        showResult:true
                    });
                    return;
                }
                const encrypted = CryptoJS.AES.encrypt(result, this.state.newsecretKey);
                const encryptedString = encrypted.toString();
                console.log("encrypted:", encrypted.toString());

                const credentials = this.state.selectedUser.map(u => {
                    return {
                        title: this.props.credentialToShare.title,
                        credential: encryptedString,
                        user_id: u.value
                    }
                });
                console.log("ready for API:", credentials);

                axios
                .post('http://localhost:8080/user/shareCredential', {
                    credentialToShare: credentials
                }, {
                    headers: {
                        'Authorization': `Bearer ${this.props.auth_token}` 
                    }
                })
                .then(res => {
                    this.setState({
                        isLoading: false,
                        isError: false,
                        secretKey: '',
                        result: 'Successfully shared',
                        showModal:false,
                        showResult:true
                    });
                    
                })
                .catch(err => {
                    console.log(err)
                    this.setState({
                        isLoading: false,
                        isError: true,
                        secretKey: '',
                        result: err?.response?.data?.message || err.message,
                        showModal:false,
                        showResult:true
                    });
                });
            }
            catch(err){
                this.setState({
                    isLoading: false,
                    isError: true,
                    secretKey: '',
                    result: 'Invalid Key',
                    showModal:false,
                    showResult:true
                });
            }
        } 
    }

    render(){
        let teamOptions = <option value="" disabled>No Team Available</option>
        if(this.props.teams.length){
            teamOptions = this.props.teams.map(t => {
                return <option key={t.id} value={t.id}>{t.name}</option>
            });
        }

        return (
            <React.Fragment>
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
                        <div className="inline-block align-bottom h-screen bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                        <div>
                            <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                Share Credential Wizard
                            </Dialog.Title>
                            <div className="mt-3 text-center sm:mt-5">
                                <div>
                                    <label htmlFor="secretKey" className="block text-sm font-medium text-gray-700">
                                        Enter Original Secret Key
                                    </label>
                                    <div className="mt-1">
                                    <input
                                        id="secretKey"
                                        name="secretKey"
                                        type="text"
                                        autoComplete="secretKey"
                                        required
                                        value={this.state.secretKey}
                                        onChange={this.handleChange}
                                        placeholder="Enter your secret key here"
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <label htmlFor="secretKey" className="block text-sm font-medium text-gray-700">
                                        Enter New Secret Key For Your Partners
                                    </label>
                                    <div className="mt-1">
                                    <input
                                        id="newsecretKey"
                                        name="newsecretKey"
                                        type="text"
                                        autoComplete="newsecretKey"
                                        required
                                        value={this.state.newsecretKey}
                                        onChange={this.handleChange}
                                        placeholder="Enter your new secret key here"
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <label htmlFor="secretKey" className="block text-sm font-medium text-gray-700">
                                        Select Team
                                    </label>
                                    <div className="mt-1">
                                        <select
                                            id="team"
                                            name="team"
                                            autoComplete="team"
                                            required
                                            value={this.state.team}
                                            onChange={this.handleChange}
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            {this.props.teams.length ? (
                                                <React.Fragment>
                                                    <option value="" disabled>Select Team</option>
                                                    {teamOptions}
                                                </React.Fragment>
                                            ) : <option value="" disabled>No Team Available</option>}
                                            
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <div className="mt-1">
                                    <MultiSelect
                                        options={this.state.users}
                                        value={this.state.selectedUser}
                                        onChange={this.handleSelectedUser}
                                        labelledBy="Select Partners"
                                    />
                                    </div>
                                </div>
                                
                                <div className="mt-2">
                                {/* <p className="text-sm text-gray-500">
                                    Enter your key to decryp your credential. We are not saving this key.
                                </p> */}
                                </div>
                            </div>
                        </div>
                            <div className="mt-5 sm:mt-6">
                            <button
                                type="button"
                                disabled={this.state.isLoading}
                                className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                onClick={this.share}
                            >
                                Share
                            </button>
                            </div>
                        </div>
                        </Transition.Child>
                    </div>
                    </Dialog>
                </Transition.Root>
                <Transition.Root show={this.state.showResult} as={Fragment}>
                <Dialog as="div" static className="fixed z-10 inset-0 overflow-y-auto" open={this.state.showResult} onClose={this.closeModel}>
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
                            {!this.state.isError ? <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" /> :  <XIcon className="h-6 w-6 text-red-600" aria-hidden="true" />}
                            </div>
                            <div className="mt-3 text-center sm:mt-5">
                            <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                Share {!this.state.isError ? "successful" : "unsuccessful" }
                            </Dialog.Title>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                    {this.state.result}
                                </p>
                            </div>
                            </div>
                        </div>
                        <div className="mt-5 sm:mt-6">
                            <button
                            type="button"
                            className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                            onClick={this.closeModel}
                            >
                            Close
                            </button>
                        </div>
                        </div>
                    </Transition.Child>
                    </div>
                </Dialog>
                </Transition.Root>

            </React.Fragment>        
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
        getAllTeams: () => dispatch(actions.getAllTeams())
    }
  }
  export default connect(mapStatToProps, mapDispatchToProps)(withRouter(ShareCredential));