import React from "react";
import socket from "../utils/socket";

function MyErrand({errand, tab, user}){

    function changeErrandState(new_state){
        socket.emit("errand-state-transition", {object_id:errand.id, new_state, user_id:user.id});
    };

    if(tab === "poster")
    return <>
        {errand && <div>{errand.id}</div>}
        {errand.state === "initial"? <button onClick={()=>changeErrandState("deleted")}>Delete</button> : 
                                    <><button onClick={()=>changeErrandState("unsuccessful")}>Cancel</button>
                                      <button onClick={()=>changeErrandState("deleted")}>Finish</button></>}
    </>

    if(tab === "runner")
    return <>
        {errand && <div>{errand.id}<button onClick={()=>changeErrandState("unsuccessful")}>Cancel</button></div>}
    </>
};

export default MyErrand;