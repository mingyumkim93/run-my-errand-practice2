import { takeLatest, put } from "redux-saga/effects";
import { actionCreators } from "./store";
import history from "./history";
import API from "./utils/API";

function* authCheck(){
    try{
        const res = yield API.auth.check();
        const data = res.data;
        if(data)
            yield put(actionCreators.authCheck(data));
    }
    catch(err){
        alert("Somthing went wrong on checking authentication");
    }
};

function* signIn(action){
   try{
       const res = yield API.auth.login(action.payload);
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
        const res = yield API.auth.logout();
        if(res.status === 200){
            yield put(actionCreators.signOut());
            yield history.push("/");
        }
    }
    catch(err){
     alert("Somthing went wrong on signing out");
     }
 };

export function* watchMany(){
    // is it correct way..?
    yield takeLatest("AUTH_CHECK_ASYNC", authCheck);
    yield takeLatest("SIGN_IN_ASYNC", signIn);
    yield takeLatest("SIGN_OUT_ASYNC", signOut);
};