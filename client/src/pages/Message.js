import React, { useState, useEffect } from "react";
import API from "../utils/api";
import socket from "../utils/socket";

export default function Message(props) {

    //change so that messages are from props not from the server
    const [messageInput, setMessageInput] = useState("");
    const [messagesWithUser, setMessagesWithUser] = useState(null);
    useEffect(() => {
        console.log(props)
        if (props.sortedMessages) {
            console.log("set message with this user in message")
            setMessagesWithUser(props.sortedMessages[window.location.pathname.split("/")[2]]);
        }
    }, []);

    useEffect(()=>{
        console.log("laskjdqwkljdqwkuhkuqwhdqwkuhk")
    }, [props.sortedMessages])

    useEffect(() => {
        if (messagesWithUser) {
            console.log("mark messages with this user as read in message")
            API.message.markMessagesAsRead(props.user.id, window.location.pathname.split("/")[2]).then(res => {
                if (res.data === "succeed") {
                    // const messagesAfterRead = messagesWithUser.map((message) => {
                    //     if(message.receiver === props.user.id){
                    //         return message = {...message, isRead:1};
                    //     }
                    //     return message
                    // });
                    // const updatedMessagesState = props.sortedMessages;
                    // updatedMessagesState[window.location.pathname.split("/")[2]] = messagesAfterRead;
                    const readStateUpdatedMessages = props.rawMessages.map((message) => {
                        if (message.receiver === props.user.id && message.sender === window.location.pathname.split("/")[2])
                            return message = { ...message, isRead: 1 }
                        return message
                    });
                    if (JSON.stringify(readStateUpdatedMessages) !== JSON.stringify(props.rawMessages))
                        props.setRawMessages(readStateUpdatedMessages);
                }
            }).catch(err => alert("there was error on changing messages read state"));
        }
    }, [messagesWithUser])

    function sendMessage() {
        socket.emit("message", { content: messageInput, receiver: window.location.pathname.split("/")[2], sender: props.user.id });
        setMessageInput("");
    };

    return (
        <div>Message
            {messagesWithUser && messagesWithUser.map(message =>
                <div key={message.id}>{message.sender} : {message.content} {message.createdAt}</div>
            )}
            <input autoFocus value={messageInput} onChange={(e) => setMessageInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && e.target.value !== "") sendMessage() }} />
            <button onClick={sendMessage}>Send</button>
        </div>
    )
}