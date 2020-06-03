import React from "react";
import socket from "../utils/socket";

function MyErrand({errand, tab, user}){
    //TODO : make ended errands are not visible with currently activated ones.
    //     : make input take review from user
    //     : nice work flow with dialog or confirm  

    function changeErrandState(new_state){
        socket.emit("errand-state-transition", {object_id:errand.id, new_state, user_id:user.id});
    };

    function deleteErrand(){
        //Do you really want to delete?
        // changeErrandState("deleted");
    };

    function cancelRunning(){
        //Do you really want to cancel? there will be penalty review
        // changeErrandState("canceled");
    };

    function doneByPoster(){
        //Do you really want to finish?  choose if it was successful or not
        //please leave review to the runner
        //changeErrandState("unsuccessful or successful");
    };

    function doneByRunner(){
        //Good job! if Poster also finish it, you will get money. (auto finish with timeout)
        //please leave review to the poster
        //changeErrandState("Should I have one more state ..? maybe?");
    }

    return <>
        <br />
        {errand.id}
        {tab === "posting" && errand.state === "initial" && <button>Delete</button>}
        {tab === "posting" && errand.state === "running" && <><button>Cancel</button><button>It's done!</button></>}
        {tab === "running" && <><button>Cancel</button><button>I did!</button></>}
    </>
};

export default MyErrand;