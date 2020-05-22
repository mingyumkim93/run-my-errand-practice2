import axios from 'axios';

export default {
    auth: {
        signUp(payload) {
            return axios.post("/auth/signup", payload);
        },
        login(payload) {
            return axios.post("/auth/login", payload);
        },
        logout() {
            return axios.get("/auth/logout");
        },
        check() {
            return axios.get("/auth/check");
        },
        getFullNameById(payload) {
            return axios.get("/auth/getFullNameById", { params: { id: payload } });
        }
    },
    errand: {
        postErrand(payload) {
            return axios.post("/errand/post", payload);
        },
        fetchAllErrands() {
            return axios.get("/errand/fetch-all");
        },
        fetchAErrand(payload) {
            return axios.get(payload);
        },
        updateErrandToRunningMode(payload){
            return axios.put("/errand/:id", payload)
        }
    },
    message: {
        fetchAllMessages(payload) {
            return axios.get("/message/fetch-all", { params: { id: payload } });
        },
        createdMessage(payload) {
            return axios.post("/message/create", payload);
        },
        fetchMessagesWithUser(payload) {
            return axios.get(payload);
        },
        markMessagesAsRead(user, other) {
            return axios.get("/message/read", { params: { user, other } });
        }
    },
    stateTransition:{
        createNewTransition(payload){
            return axios.post("/state-transition/create", payload);
        },
        getCurrentState(payload){
            return axios.get("/state-transition", { params: { id: payload}})   
        }
    
    }
}