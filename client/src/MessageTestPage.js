import React, {useState, useEffect} from 'react';
import axios from 'axios';

export default function MessageTestPage ({user, socket}) {

    const [messageInput, setMessageInput] = useState("");
    const [messages, setMessages] = useState(null);
    const [receiver, setReceiver] = useState(null);
    useEffect(()=>{
        axios.get("/api/messagesToMe").then(res => {console.log(res.data);setMessages(res.data)}).catch(err=>alert(err));
        if(user) {if(user.email === "asd@asd.com") setReceiver("dddn1246@gmail.com"); else{setReceiver("asd@asd.com")}}
    },[])
    useEffect(()=> {
        if(messages)
        socket.on("message", (message) => setMessages([...messages, message]));
    },[messages])

    function sendMessage(){
        socket.emit("message", {
            sender: user.email,
            receiver,
            text: messageInput
        });
        setMessageInput(""); 
        setMessages([...messages, {
            sender: user.email,
            receiver,
            text: messageInput
        }])
    }
    let i = 0;
    return(
        <div>
        <h2>message test</h2>
        {messages && messages.map(message => <div key={i++}>{message.sender} : {message.text}</div>)}
        <input placeholder="message input" value={messageInput} onChange={(e) => setMessageInput(e.target.value)} onKeyDown={(e)=>{if(e.key ==="Enter")sendMessage()}}/>
            <button onClick={() => {
                sendMessage()
            }}>send</button>
        </div>
    )
}