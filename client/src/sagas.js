import { takeLatest, put, call, all } from "redux-saga/effects";
import { actionCreators } from "./store";
import history from "./history";
import api from "./utils/api";

function* authCheck(){
    try{
        const res = yield call(api.auth.check);
        const data = res.data;
        if(data)
            yield all([put(actionCreators.authCheck(data)), put({type:"FETCH_MESSAGES_ASYNC", payload:{id:data.id}})]);
    }
    catch(err){
        alert("Somthing went wrong on checking authentication");
    }
};

function* signIn(action){
   try{
       const res = yield call(api.auth.login, action.payload);
       const data = res.data;
       yield put(actionCreators.signIn(data));
       yield history.push("/");
   }
   catch(err){
    alert("Somthing went wrong on signing in");
    }
};

function* signOut(){
    try{
        const res = yield call(api.auth.logout);
        if(res.status === 200){
            yield put(actionCreators.signOut());
            yield history.push("/");
        }
    }
    catch(err){
     alert("Somthing went wrong on signing out");
     }
 };

function* fetchMessage(action){
    try{
        const res = yield call(api.message.fetchAllMessages, action.payload.id);
        const data = res.data;
        yield put(actionCreators.fetchMessages(data));
    }
    catch(err){
     alert("Somthing went wrong on fetching message");
    }
};

export function* watchMany(){
    yield takeLatest("AUTH_CHECK_ASYNC", authCheck);
    yield takeLatest("SIGN_IN_ASYNC", signIn);
    yield takeLatest("SIGN_OUT_ASYNC", signOut);
    yield takeLatest("FETCH_MESSAGES_ASYNC", fetchMessage);
};