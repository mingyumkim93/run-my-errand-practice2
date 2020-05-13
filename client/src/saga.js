import { takeLatest, put } from "redux-saga/effects";
import { actionCreators } from "./store";
import API from "./utils/API";

function* authCheck(){
    try{
        const res = yield API.auth.check()
        const data = res.data;
        yield put(actionCreators.authCheck(data));
    }
    catch(err){
        alert("Somthing went wrong on checking authentication", err)
    }
};

export function* watchSignIn(){
    yield takeLatest("AUTH_CHECK", authCheck);
};