import React from "react";
import socket from "../utils/socket";

function MyErrand({errand, tab, user}){

    function changeErrandState(new_state){
        socket.emit("errand-state-transition", {object_id:errand.id, new_state, user_id:user.id});
    };

    function deleteErrand(){
        const confirmDelete = window.confirm("Do you really want to finish it?");
        if(confirmDelete)  changeErrandState("deleted");
    };

    function cancelRunning(){
        const confirmCancel = window.confirm("Do you really want to cancel? There will be panalty review!");
        if(confirmCancel) changeErrandState("canceled");
    };

    function doneByPoster(){
        const isSuccessful = window.confirm("Did runner do good job?");
        const reviewRating = window.prompt("Give rating to the runner");
        const reviewComment = window.prompt("Give a comment");
        const confirmDone = window.confirm(`Your answer: ${isSuccessful ? "Successful":"Unsuccessful"}, ${reviewRating} rating, comment: ${reviewComment}. 
                                        Are you really sure you want to submit it?`);
        if(confirmDone) {
            changeErrandState(isSuccessful? "successful" : "unsuccessful");
            //create review
        }
    };

    function doneByRunner(){
        window.alert("Good job! Once poster also confirm it, you will get your money. (There is timeout)");
        const reviewRating = window.prompt("Give rating to the poster");
        const reviewComment = window.prompt("Give a comment");
        const confirmDone = window.confirm(`Your review to poster: ${reviewRating} rating, comment: ${reviewComment}. 
                                        Are you really sure you want to submit it?`);
        if(confirmDone){
            changeErrandState("doneByRunner");
        }
    }

    return <>
        <br />
        {errand.id}
        {tab === "posting" && errand.state === "initial" && <button onClick={()=>deleteErrand()}>Delete</button>}
        {tab === "posting" && errand.state === "running" && <><button onClick={()=>cancelRunning()}>Cancel</button><button onClick={()=>doneByPoster()}>It's done!</button></>}
        {tab === "running" && <><button onClick={()=>cancelRunning()}>Cancel</button><button onClick={()=>doneByRunner()}>I did!</button></>}
    </>
};

export default MyErrand;