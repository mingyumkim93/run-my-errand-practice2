import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { connect } from "react-redux";

function MyErrands({user}){

    const [myErrands, setMyErrands] = useState(null);
    const [tab, setTab] = useState("post");

    useEffect(()=>{
        if(user)
        {
            api.errand.fetchMyErrands(user.id).then(res => setMyErrands(res));
        }
    },[user]);

    return(
        <>
            <br/>
            <button onClick={()=>{
                if(tab === "post") setTab("run")
                else setTab("post")
            }}>{tab}</button> 
            <button onClick={()=>console.log(myErrands)}>see my errands</button>
        </>
    );
};

function mapStateToProps(state){
    return {
        user : state.user
    };
};

export default connect(mapStateToProps)(MyErrands);