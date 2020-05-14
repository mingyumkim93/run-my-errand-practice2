import { createAction, createReducer, configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { watchMany } from "./sagas";

const sagaMiddleware = createSagaMiddleware();
const middleware = [...getDefaultMiddleware(), sagaMiddleware];

const initialState = {
    user: null,
    // keep errands here or in Search component?
    errands: null,
    messages: null
};

const authCheck = createAction("AUTH_CHECK");
const signIn = createAction("SIGN_IN");
const signOut = createAction("SIGN_OUT");
const fetchMessages = createAction("FETCH_MESSAGES");
const emptyMessages = createAction("EMPTY_MESSAGES");
const readMessages = createAction("READ_MESSAGES");

const reducer = createReducer(initialState, {
    // it's ok to mutate state here because toolkit works with Immer
    [signIn]: (state, action) => { state.user = action.payload },
    [signOut]: (state, action) => { state.user = null },
    [authCheck]: (state, action) => { state.user = action.payload },
    [fetchMessages]: (state, action) => { state.messages = action.payload},
    [emptyMessages]: (state, action) => { state.messages = null},
    [readMessages]: (state, action) => {state.messages = action.payload}
});

export const actionCreators = {
    authCheck,
    signIn,
    signOut,
    fetchMessages,
    emptyMessages
};

const store = configureStore({ reducer,  middleware});
sagaMiddleware.run(watchMany);

export default store;