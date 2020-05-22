import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { connect } from "react-redux";

function MyErrands({user}){

    const [errandsImRunning, setErrandsImRunning] = useState(null);
    const [errandsImPosting, setErrandsImPosting] = useState(null);
    const [tab, setTab] = useState("post");

    useEffect(()=>{
        if(user)
        {
            api.errand.fetchErrandsIPost(user.id).then(res=>setErrandsImPosting(res.data));
            api.errand.fetchErrandsIRun(user.id).then(res=>setErrandsImRunning(res.data));
        }
    },[user]);

    return(
        <>
            <h3>my errands</h3>
            <button onClick={()=>{
                if(tab === "post") setTab("run")
                else setTab("post")
            }}>{tab}</button> 
            {tab === "post" ? (errandsImPosting && errandsImPosting.map(errand => <div>{errand.id}</div>)) : (errandsImRunning && errandsImRunning.map(errand => <div>{errand.id}</div>))}
        </>
    );
};

function mapStateToProps(state){
    return {
        user : state.user
    };
};

export default connect(mapStateToProps)(MyErrands);