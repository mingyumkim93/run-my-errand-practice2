import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { connect } from "react-redux";
import MyErrand from "../components/MyErrand";

function MyErrands({user}){

    const [myErrands, setMyErrands] = useState(null);
    const [tab, setTab] = useState("posting");
    const [errandsToShow, setErrandsToShow] = useState(null);

    useEffect(()=>{
        if(user)
        {
            api.errand.fetchMyErrands(user.id).then(res => setMyErrands(res.data));
        }
    },[user]);

    useEffect(()=>{
        if(myErrands && tab){
            if(tab === "history"){
                const terminatedErrands = myErrands.filter(errand => errand.state === "unsuccessful" || errand.state === "successful" || errand.state === "deleted");
                setErrandsToShow(terminatedErrands);
            }
            else if(tab === "posting"){
                const myActivatedPosting = myErrands.filter(errand => (errand.state === "initial" || errand.state === "running") && errand.poster_id === user.id);
                setErrandsToShow(myActivatedPosting);
            }
            else if(tab === "running"){
                const myActivatedRunning = myErrands.filter(errand => errand.state === "running" && errand.runner_id === user.id);
                setErrandsToShow(myActivatedRunning);
            }
        }
    }, [myErrands, tab, user]);

    return(
        <> 
            <br/>
            <button value="posting" onClick={(e)=>setTab(e.target.value)}>Posting</button>
            <button value="running" onClick={(e)=>setTab(e.target.value)}>Running</button>
            <button value="history" onClick={(e)=>setTab(e.target.value)}>History</button>
            <button onClick={()=>console.log(myErrands)}>see my errands</button>
            {errandsToShow && errandsToShow.map(errand => <MyErrand key={errand.id} errand={errand} tab={tab} user={user} />)}
        </>
    );
};

function mapStateToProps(state){
    return {
        user : state.user
    };
};

export default connect(mapStateToProps)(MyErrands);