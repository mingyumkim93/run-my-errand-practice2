import { takeLatest, put, call, all, select } from "redux-saga/effects";
import { actionCreators } from "./store";
import history from "./history";
import api from "./utils/api";

function* authCheck() {
    try {
        const res = yield call(api.auth.check);
        const data = res.data;
        if (data)
            yield all([put(actionCreators.authCheck(data)), put({ type: "FETCH_MESSAGES_ASYNC", payload: { id: data.id } })]);
    }
    catch (err) {
        alert("Somthing went wrong on checking authentication");
    }
};

function* signIn(action) {
    try {
        const res = yield call(api.auth.login, action.payload);
        const data = res.data;
        yield all([put(actionCreators.signIn(data)), put({ type: "FETCH_MESSAGES_ASYNC", payload: { id: data.id } })]);
        yield history.push("/");
    }
    catch (err) {
        alert("Somthing went wrong on signing in");
    }
};

function* signOut() {
    try {
        const res = yield call(api.auth.logout);
        if (res.status === 200) {
            yield all([put(actionCreators.signOut()), put(actionCreators.emptyMessages()), put(actionCreators.emptySortedMessages())]);
            yield history.push("/");
        }
    }
    catch (err) {
        alert("Somthing went wrong on signing out");
    }
};

function* fetchMessages(action) {
    try {
        const res = yield call(api.message.fetchAllMessages, action.payload.id);
        const data = res.data;
        yield put(actionCreators.fetchMessages(data));
    }
    catch (err) {
        alert("Somthing went wrong on fetching message");
    }
};

function* readMessages(action) {
    try {
        const res = yield call(api.message.markMessagesAsRead, action.id, action.othersId);
        if (res.status === 200) {
            const state = yield select();
            const messages = state.messages;
            const updatedMessages = messages.map(message => {
                if (message.sender === action.othersId && message.receiver === action.id)
                    return { ...message, isRead: 1 }
                else if(message.receiver === action.id && message.relatedUser === action.othersId){
                    return { ...message, isRead: 1 }
                }
                else
                    return message
            });
            if(JSON.stringify(messages) !== JSON.stringify(updatedMessages))
               yield put(actionCreators.readMessages(updatedMessages));
        }
    }
    catch (err) {
        alert("something went wrong on marking messages as read");
    }
};

export function* watchMany() {
    yield takeLatest("AUTH_CHECK_ASYNC", authCheck);
    yield takeLatest("SIGN_IN_ASYNC", signIn);
    yield takeLatest("SIGN_OUT_ASYNC", signOut);
    yield takeLatest("FETCH_MESSAGES_ASYNC", fetchMessages);
    yield takeLatest("READ_MESSAGES_ASYNC", readMessages);
};