import React from "react";
import api from "../utils/api";
function Offer ({message, user}){
    

    function withdrawOffer(){  
        api.stateTransition.CreateNewTransition({object_id: message.id, new_state:"canceled"}).then(res => console.log("offer is canceled"));
    };

    return(
        <>
            <div key={message.id}>
            <h4>{message.sender} sent offer to this errand {message.errand}</h4>
                {message.sender} : {message.content} {message.createdAt} 
                {/* poster accepts -> send notification to the runner & errand state change -> runner accpets*/}
                {message.sender === user.id ?<button onClick={()=> withdrawOffer()}>Withdraw</button> :<button>Accept</button>}
                </div>
        </>
    );
};

export default Offer;