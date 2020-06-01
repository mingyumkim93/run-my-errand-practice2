import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { connect } from "react-redux";
import MyErrand from "../components/MyErrand";

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
            <button onClick={()=>console.log(myErrands)}>see my errands</button>
            {myErrands && myErrands.filter(errand => errand[tab] === user.id).map(errand => <MyErrand key={errand.id} errand={errand} tab={tab} user={user} />)}
        </>
    );
};

function mapStateToProps(state){
    return {
        user : state.user
    };
};

export default connect(mapStateToProps)(MyErrands);