import * as routes from '../utility/routes';
import jwt_decode from 'jwt-decode';
const axios = require('axios');


export const LOADING_START = 'LOADING_START';
export const LOGOUT = 'LOGOUT';
export const LOADING_STOP = 'LOADING_STOP';
export const LOGIN_WITH_SUCCESS = 'LOGIN_WITH_SUCCESS';
export const LOGIN_WITH_FAILURE = 'LOGIN_WITH_FAILURE';
export const FAILURE = 'FAILURE';
export const GET_ALL_CREDENTIALS_WITH_SUCCESS = 'GET_ALL_CREDENTIALS_WITH_SUCCESS';
export const GET_ALL_CREDENTIALS_WITH_FAILURE = 'GET_ALL_CREDENTIALS_WITH_FAILURE';
export const GET_ALL_TEAMS_WITH_SUCCESS = 'GET_TEAMS_WITH_SUCCESS';
export const GET_ALL_TEAMS_WITH_FAILURE = 'GET_TEAMS_WITH_FAILURE';
export const SHARE_CREDENTIAL = 'SHARE_CREDENTIAL';


export const GET_PROFILE_WITH_SUCCESS = 'GET_PROFILE_WITH_SUCCESS';
export const GET_PROFILE_WITH_FAILURE = 'GET_PROFILE_WITH_FAILURE';


// async actions
export const login = ({ email, password, history }) => {
    return dispatch => {
      dispatch({type: LOADING_START});
  
      axios
        .post(process.env.REACT_APP_BACKEND_SERVER_URL+'/auth/login', {
          email,
          password
        })
        .then(res => {
            localStorage.setItem('jwtToken', res.data);
            const decoded = jwt_decode(res.data);
            dispatch({type: LOGIN_WITH_SUCCESS, payload: {auth_token: res.data, loggedUser: decoded}});
            dispatch({type: LOADING_STOP});
            history.push(routes.DASHBOARD);
        })
        .catch(err => {
            dispatch({type: LOGIN_WITH_FAILURE, payload: {errorMessage: err?.response?.data?.message || err.message}});
            dispatch({type: LOADING_STOP});
        });
    };
  };

  export const logout = () => {
    return dispatch => {
      localStorage.removeItem('jwtToken');
      dispatch({type: LOGOUT})
    }
  }

  export const signup = ({ full_name, email, password, invite, history }) => {
    return dispatch => {
      dispatch({type: LOADING_START});
  
      axios
        .post('http://localhost:8080/auth/signup', {
          full_name,
          email,
          password,
          invite
        })
        .then(res => {
            localStorage.setItem('jwtToken', res.data);
            const decoded = jwt_decode(res.data);
            dispatch({type: LOGIN_WITH_SUCCESS, payload: {auth_token: res.data, loggedUser: decoded}});
            if(invite){
              axios
              .get('http://localhost:8080/user/verify/'+invite)
              .then(res => {
                  dispatch({type: LOADING_STOP});
                  history.push(routes.DASHBOARD+'?message=Invitation Accepted Successfully');
              })
              .catch(err => {
                  dispatch({type: LOGIN_WITH_FAILURE, payload: {errorMessage: err?.response?.data?.message || err.message}});
                  dispatch({type: LOADING_STOP});
                  history.push(routes.DASHBOARD+'?message=Invitation Accepted Successfully');
              });
            }
            else{
              dispatch({type: LOADING_STOP});
              history.push(routes.DASHBOARD);
            }
        })
        .catch(err => {
            dispatch({type: LOGIN_WITH_FAILURE, payload: {errorMessage: err?.response?.data?.message || err.message}});
            dispatch({type: LOADING_STOP});
        });
    };
  };

  export const saveCredential = ({ title, credential, history }) => {
    return (dispatch, getState) => {
      dispatch({type: LOADING_START});
  
      axios
        .post('http://localhost:8080/user/saveCredential', {
          title,
          credential,
        }, {
            headers: {
                'Authorization': `Bearer ${getState().auth_token}` 
            }
        })
        .then(res => {
            dispatch({type: LOADING_STOP});
            history.push(routes.CREDENTIALS);
        })
        .catch(err => {
            console.log(err)
            dispatch({type: FAILURE, payload: {errorMessage: err?.response?.data?.message || err.message}});
            dispatch({type: LOADING_STOP});
        });
    };
  };

  export const getAllCredentials = () => {
    return (dispatch, getState) => {
      dispatch({type: LOADING_START});
  
      axios
        .get('http://localhost:8080/user/getAllCredentials', {
            headers: {
                'Authorization': `Bearer ${getState().auth_token}` 
            }
        })
        .then(res => {
            dispatch({type: GET_ALL_CREDENTIALS_WITH_SUCCESS, payload: {credentials: res.data}});
            dispatch({type: LOADING_STOP});
        })
        .catch(err => {
            dispatch({type: GET_ALL_CREDENTIALS_WITH_FAILURE, payload: {errorMessage: err?.response?.data?.message || err.message}});
            dispatch({type: LOADING_STOP});
        });
    };
  };

export const getAllTeams = () => {
    return (dispatch, getState) => {
      dispatch({type: LOADING_START});
  
      axios
        .get('http://localhost:8080/user/getAllTeams', {
            headers: {
                'Authorization': `Bearer ${getState().auth_token}` 
            }
        })
        .then(res => {
            dispatch({type: GET_ALL_TEAMS_WITH_SUCCESS, payload: {teams: res.data}});
            dispatch({type: LOADING_STOP});
        })
        .catch(err => {
            dispatch({type: GET_ALL_TEAMS_WITH_FAILURE, payload: {errorMessage: err?.response?.data?.message || err.message}});
            dispatch({type: LOADING_STOP});
        });
    };
};



export const getUserProfile = () => {
  return (dispatch, getState) => {
      dispatch({type: LOADING_START});

      axios
      .get(process.env.REACT_APP_BACKEND_SERVER_URL+'/user/get-profile', {
          headers: {
              'Authorization': `Bearer ${getState().auth_token}` 
          }
      })
      .then(res => {
          dispatch({type: GET_PROFILE_WITH_SUCCESS, payload: {profile: res.data}});
          dispatch({type: LOADING_STOP});
      })
      .catch(err => {
          dispatch({type: GET_PROFILE_WITH_FAILURE, payload: {errorMessage: err?.response?.data?.message || err.message}});
          dispatch({type: LOADING_STOP});
      });
  };
};


export const updateUserProfile = (profile) => {
  return (dispatch, getState) => {
    axios
    .post(process.env.REACT_APP_BACKEND_SERVER_URL + '/user/update-profile', profile, {
        headers: {
            'Authorization': `Bearer ${getState().auth_token}` 
        }
    })
    .then(res => {
        dispatch({type: LOADING_STOP});
    })
    .catch(err => {
        console.log(err)
        dispatch({type: FAILURE, payload: {errorMessage: err?.response?.data?.message || err.message}});
        dispatch({type: LOADING_STOP});
    });

  }
}