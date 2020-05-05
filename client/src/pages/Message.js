import React, { useState } from "react";
import API from "../utils/API";

export default function Message(props) {

    const [messageInput, setMessageInput] = useState("");

    return(
        <div>Message
            <input onChange={(e)=>setMessageInput(e.target.value)}/>
            <button onClick={()=>{
                API.message.createdMessage({content:messageInput, receiver:window.location.href.split("/").pop(),sender:props.user.id
            }).then(res => console.log(res));
            }}>Send</button>
        </div>
    )
}