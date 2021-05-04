import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../store/actions';
import Loader from "react-loader-spinner";
import { withRouter } from 'react-router';

class EditProfile extends Component {

  constructor(props) {
    super(props)
    this.state = {
      errorMessage: '',
      full_name: '',
      isError: false,
      isLoading: false,
      dummy: {}
    }
  }

  componentDidMount = () => {
    this.props.getUserProfile();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log('here')
    if( JSON.stringify(nextProps.dummy) != JSON.stringify(prevState.dummy) ) {
      console.log('nextProps, prevState', nextProps, prevState)
      return {
        full_name: nextProps.profile.full_name
      }
    }
    return prevState;
  }


  onChangeHandler = e => {
    console.log('this.state, e', this.state, e)
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  


  updateFullName = () => {
    this.props.updateUserProfile({
      full_name: this.state.full_name
    });
  }

  updateProfileSubmitHanlder = (e) => {
    e.preventDefault();
  }
  


  render(){
    console.log('in render', this.state)
    if(this.props.isLoading){
      return (<div className='bg-white'>
                <div className="px-6 py-4 whitespace-nowrap text-sm self-center text-gray-500">
                    <Loader
                        type="TailSpin"
                        color="#00BFFF"
                        height={100}
                        width={100}
                        className="px-96 text-gray-500"
                    />
                </div>
            </div>
      );
    }


    return (
      <div className="flex flex-col justify-center sm:w-96 sm:m-auto mx-5 mb-5 space-y-8">
        <h1 className="font-bold text-center text-4xl text-yellow-500">Edit Profile</h1>

        <form action="#" onSubmit={this.updateProfileSubmitHanlder}>
        
          <div className="flex flex-col bg-white p-10 rounded-lg shadow space-y-6">

            <div className="flex flex-col space-y-1">
              <input 
                type="text" 
                name="full_name" 
                id="full_name" 
                className="border-2 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-400 focus:shadow" 
                placeholder="Full Name" 
                value={this.state.full_name}
                onChange={this.onChangeHandler}/>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-between items-center">
              <button 
                type="submit" 
                className="bg-blue-500 text-white font-bold px-5 py-2 rounded focus:outline-none shadow hover:bg-blue-700 transition-colors"
                onClick={this.updateFullName}>
                
                Update
              </button>
            </div>

          </div>

        </form>

        <form action="#">
          <div className="flex flex-col bg-white p-10 rounded-lg shadow space-y-6">
            <h3>Update Password</h3>

            <div className="flex flex-col space-y-1">
              <input 
                type="password" 
                name="old_password" 
                id="new_password" 
                className="border-2 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-400 focus:shadow" 
                placeholder="Old Password" />
            </div>

            <div className="flex flex-col space-y-1">
              <input 
                type="password" 
                name="new_password" 
                id="new_password" 
                className="border-2 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-400 focus:shadow" 
                placeholder="New Password" />
            </div>           

            <div className="flex flex-col-reverse sm:flex-row sm:justify-between items-center">
              <a href="#" className="inline-block text-blue-500 hover:text-blue-800 hover:underline">Forgot your password?</a>
              <button type="submit" className="bg-blue-500 text-white font-bold px-5 py-2 rounded focus:outline-none shadow hover:bg-blue-700 transition-colors">Log In</button>
            </div>
          </div>
        </form>

      </div>
      
    )

  }


}


  const mapStatToProps = state => {
    return {
      profile: state.profile,
      isLoading: state.isLoading
    }
  }

  const mapDispatchToProps = dispatch => {
    return {
      getUserProfile: () => dispatch(actions.getUserProfile()),
      updateUserProfile: (profile) => dispatch(actions.updateUserProfile(profile)),
    }
  }
  
  export default connect(mapStatToProps, mapDispatchToProps)(withRouter(EditProfile));