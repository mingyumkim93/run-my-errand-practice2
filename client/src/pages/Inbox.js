import React, { useEffect, useState } from "react";
import history from "../history";
import API from "../utils/API";

export default function Inbox(props) {
    // get messages via props and sort and render them

    const [messages, setMessages] = useState({});
    const [idNameTable, setIdNameTable] = useState({});

    const sortMessages = () => {
        let sortedMessages = {};
        props.messages.forEach(message => {
            // if the message is sent to me
            if(message.sender !== props.user.id){
                // first message with this user
                if(!sortedMessages[message.sender]){
                    sortedMessages = {...sortedMessages, [message.sender] : [message]};
                }
                else{
                    sortedMessages[message.sender].push(message);
                }
            }

            // if the message is sent by me
            else{
                if(!sortedMessages[message.receiver]){
                    sortedMessages = {...sortedMessages, [message.receiver] : [message]};
                }
                else{
                    sortedMessages[message.receiver].push(message);
                }
            }
        });
        setMessages(sortedMessages);
    };

    useEffect(()=>{
        if(props.messages)sortMessages()
        //if there is message
    }, []);

    useEffect(()=>{
        let idAndFullName = {};
        if(Object.keys(messages).length !== 0)
        {
            Object.keys(messages).forEach(key => {
                API.auth.getFullNameById(key).then(res => {idAndFullName = {...idAndFullName, [key]:res.data[0].firstname + " " + res.data[0].lastname}
                setIdNameTable(idAndFullName);
            });
            });
        }
    }, [messages]);

    return(
        <div>
            <div>Inbox Page</div>
            {messages && Object.keys(messages).map((person) => 
                <div onClick={()=>history.push(`/message/${person}`)} key ={person}>{idNameTable[person]} {messages[person][messages[person].length-1].content}</div>
            )}
        </div>
    );
}