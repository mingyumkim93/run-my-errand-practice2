import React from "react";
function Offer ({message, user}){
    
    return(
        <>
            <div key={message.id}>
            <h4>{message.sender} sent offer to this errand {message.errand}</h4>
                {message.sender} : {message.content} {message.createdAt} 
                {/* poster accepts -> send notification to the runner & errand state change -> runner accpets*/}
                {message.sender === user.id ?<button>Withd raw</button> :<button>Accept</button>}
                </div>
        </>
    );
};

export default Offer;