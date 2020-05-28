import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { connect } from "react-redux";

function MyErrands({user}){

    const [myErrandsRun, setMyErrandsRun] = useState(null);
    const [myErandsPost, setMyErrandsPost] = useState(null);
    const [tab, setTab] = useState("post");

    useEffect(()=>{
        if(user)
        {
            api.errand.fetchErrandsIPost(user.id).then(res=>setMyErrandsPost(res.data));
            api.errand.fetchErrandsIRun(user.id).then(res=>setMyErrandsRun(res.data));
        }
    },[user]);

    return(
        <>
            <br/>
            <button onClick={()=>{
                if(tab === "post") setTab("run")
                else setTab("post")
            }}>{tab}</button> 
            {tab === "post" ? (myErandsPost && myErandsPost.map(errand => <div key={errand.id}>{errand.id}<button>Cancel</button><button>Confirm</button></div>)) : 
                              (myErrandsRun && myErrandsRun.map(errand => <div key={errand.id}>{errand.id}<button>Cancel</button><button>Done</button></div>))}
        </>
    );
};

function mapStateToProps(state){
    return {
        user : state.user
    };
};

export default connect(mapStateToProps)(MyErrands);