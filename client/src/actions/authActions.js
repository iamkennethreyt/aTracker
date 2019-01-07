import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { GET_ERRORS, SET_CURRENT_USER } from "./types";

//Login User
export const loginUser = userdata => dispatch => {
  axios
    .post("/api/teachers/login", userdata)
    .then(res => {
      //save to local storage
      const { token } = res.data;

      //set token to localstorage
      localStorage.setItem("jwtToken", token);

      //set token to auth header
      setAuthToken(token);

      //decode token to get user data
      const decoded = jwt_decode(token);

      //set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Change password
export const changePassword = (userdata, history) => dispatch => {
  axios
    .post("/api/users/accountsettings", userdata)
    .then(() => history.push("/"))
    .then(() => alert("SUCCESSFULLY CHANGED THE PASSWORD"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

//logout user
export const logoutUser = history => dispatch => {
  //remove token from localstorage
  localStorage.removeItem("jwtToken");
  //remove auth header for future requests
  setAuthToken(false);

  //set current user to {} which will set isAuthenticated is false
  dispatch(setCurrentUser({}));
};
