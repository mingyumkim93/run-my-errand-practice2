import React from "react";
function Offer ({message, user}){
    
    return(
        <>
            <div key={message.id}>
                <h4>{message.sender} sent offer to this errand</h4>
                {/* add "errand" column in message table so that it can refer errand here */}
                {message.sender} : {message.content} {message.createdAt} 
                {/* poster accepts -> send notification to the runner & errand state change -> runner accpets? or just immediately starts?... */}
                {message.sender === user.id ?<button>Withd raw</button> :<button>Accept</button>}
                </div>
        </>
    );
};

export default Offer;