import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { connect } from "react-redux";

function MyErrands({user}){

    const [myErrands, setMyErrands] = useState(null);
    const [tab, setTab] = useState("poster");

    useEffect(()=>{
        if(user)
        {
            api.errand.fetchMyErrands(user.id).then(res => setMyErrands(res.data));
        }
    },[user]);

    return(
        <>
            <br/>
            <button value="poster" onClick={(e)=>setTab(e.target.value)}>Posting</button>
            <button value="runner" onClick={(e)=>setTab(e.target.value)}>Running</button>
            {myErrands && myErrands.filter(errand => errand[tab] === user.id).map(errand => 
                tab === "poster" ? <div key={errand.id}>{errand.id} <button>Cancel</button>{errand.state === "initial" ? <div></div> : <button>Finish</button>}</div>
                                    : <div key={errand.id}>{errand.id} <button>Cancel</button><button>Finish</button></div>
            )}
        </>
    );
};

function mapStateToProps(state){
    return {
        user : state.user
    };
};

export default connect(mapStateToProps)(MyErrands);