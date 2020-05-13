import { createAction, createReducer, configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { watchSignIn } from "./saga";

const sagaMiddleware = createSagaMiddleware();
const middleware = [...getDefaultMiddleware(), sagaMiddleware]

const initialState = {
    user: [],
    errands: [],
    messages: []
}

const authCheck = createAction("AUTH_CHECK_ASYNC");
const signIn = createAction("SIGN_IN_ASYNC");
const signOut = createAction("SIGN_OUT");

const reducer = createReducer(initialState, {
    // it's ok to mutate state here with toolkit
    [signIn]: (state, action) => { state.user.push(action.payload) },
    [signOut]: (state, action) => { state.user = [] },
    [authCheck]: (state, action) => { state.user.push(action.payload)}
});

export const actionCreators = {
    authCheck,
    signIn,
    signOut,
};

const store = configureStore({ reducer,  middleware});
sagaMiddleware.run(watchSignIn);

export default store;