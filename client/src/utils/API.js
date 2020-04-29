import axios from 'axios';

export default {
    auth:{
        signUp(payload){
            return axios.post("/auth/signup", payload);
        },
        login(payload){
            return axios.post("/auth/login", payload);
        },
        logout(){
            return axios.get("/auth/logout");
        },
        check(){
            return axios.get("/auth/check");
        }
    },
    errand:{
        postErrand(payload){
            return axios.post("/errand/post", payload);
        },
        fetchAllErrands(){
            return axios.get("/errand/fetch-all")
        },
        fetchAErrand(payload){
            return axios.get(payload);
        }
    }
}