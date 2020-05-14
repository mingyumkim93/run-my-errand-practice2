import { createAction, createReducer, configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { watchMany } from "./sagas";

const sagaMiddleware = createSagaMiddleware();
const middleware = [...getDefaultMiddleware(), sagaMiddleware];

const initialState = {
    user: null,
    messages: null,
    sortedMessages: null
};

const authCheck = createAction("AUTH_CHECK");
const signIn = createAction("SIGN_IN");
const signOut = createAction("SIGN_OUT");
const fetchMessages = createAction("FETCH_MESSAGES");
const emptyMessages = createAction("EMPTY_MESSAGES");
const readMessages = createAction("READ_MESSAGES");
const addMessage = createAction("ADD_MESSAGE");
const sortMessages = createAction("SORT_MESSAGES");

const reducer = createReducer(initialState, {
    // it's ok to mutate state here because toolkit works with Immer
    // from sagas
    [signIn]: (state, action) => { state.user = action.payload },
    [signOut]: (state, action) => { state.user = null },
    [authCheck]: (state, action) => { state.user = action.payload },
    [fetchMessages]: (state, action) => { state.messages = action.payload },
    [emptyMessages]: (state, action) => { state.messages = null },
    [readMessages]: (state, action) => { state.messages = action.payload },

    // none sagas
    [addMessage]: (state, action) => { state.messages.push(action.payload) },
    [sortMessages]: (state, action) => {
        let sortedMessages = {};
        state.messages.forEach(message => {
            // if the message is sent to me
            if (message.sender !== action.payload) {
              // first message with this user
              if (!sortedMessages[message.sender]) {
                sortedMessages = { ...sortedMessages, [message.sender]: [message] };
              }
              else {
                sortedMessages[message.sender].push(message);
              }
            }
            // if the message is sent by me
            else {
              if (!sortedMessages[message.receiver]) {
                sortedMessages = { ...sortedMessages, [message.receiver]: [message] };
              }
              else {
                sortedMessages[message.receiver].push(message);
              }
            }
          });
        state.sortedMessages = sortedMessages;
    }
});

export const actionCreators = {
    authCheck,
    signIn,
    signOut,
    fetchMessages,
    emptyMessages,
    readMessages,
    addMessage,
    sortMessages
};

const store = configureStore({ reducer, middleware });

sagaMiddleware.run(watchMany);

export default store;