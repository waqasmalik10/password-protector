import * as actionsType from './actions';

export const init = {
    isLoading: false,
    isError: false,
    errorMessage: '',
    isAuthenticated: false,
    auth_token: null,
    loggedUser: null,
    credentials: [],
    teams: [],
    credentialToShare: null,
    profile: {}
}

export const reducer = (state = init, action) => { //es6 arrow function
    switch (action.type) {
        case actionsType.LOADING_START:
          return {
              ...state,
              isLoading: true
          }
        case actionsType.LOADING_STOP:
          return {
              ...state,
              isLoading: false
          }
        case actionsType.LOGIN_WITH_SUCCESS:
          return {
              ...state,
              isError: false,
              isAuthenticated: true,
              auth_token: action.payload.auth_token,
              loggedUser: action.payload.loggedUser
          }
        case actionsType.LOGOUT:
            return {
                ...state,
                isError: false,
                isAuthenticated: false,
                auth_token: null,
                loggedUser: null
            }
        case actionsType.LOGIN_WITH_FAILURE:
          return {
              ...state,
              isError: true,
              errorMessage: action.payload.errorMessage
          }
        case actionsType.FAILURE:
            return {
                ...state,
                isError: true,
                errorMessage: action.payload.errorMessage
            }
        case actionsType.GET_ALL_CREDENTIALS_WITH_SUCCESS:
            return {
                ...state,
                isError: false,
                credentials: action.payload.credentials
            }
        case actionsType.GET_ALL_CREDENTIALS_WITH_FAILURE:
            return {
                ...state,
                isError: true,
                errorMessage: action.payload.errorMessage
            }
        case actionsType.GET_ALL_TEAMS_WITH_SUCCESS:
            return {
                ...state,
                isError: false,
                teams: action.payload.teams
            }
        case actionsType.GET_ALL_TEAMS_WITH_FAILURE:
            return {
                ...state,
                isError: true,
                errorMessage: action.payload.errorMessage
            }
        case actionsType.SHARE_CREDENTIAL:
            return {
                ...state,
                credentialToShare: action.payload.credential
            }

        case actionsType.GET_PROFILE_WITH_SUCCESS:
            return {
                ...state,
                profile: action.payload.profile
            }

       default:
          return state;
    }
 }