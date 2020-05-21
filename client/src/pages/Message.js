import React, { useState, useEffect } from "react";
import socket from "../utils/socket";
import { connect } from "react-redux";
import Offer from "../components/Offer";

function Message({ user, sortedMessages, readMessages }) {

    //todo: fix error when user sign out in message

    const [messageInput, setMessageInput] = useState("");
    const [messagesWithThisUser, setMessagesWithThisUser] = useState(null);

    useEffect(()=>{
        console.log("setMessagesWithThisUser");
        if(sortedMessages)
            setMessagesWithThisUser(sortedMessages[window.location.pathname.split("/")[2]]);
    }, [sortedMessages, setMessagesWithThisUser]);

    useEffect(() => {
        console.log("read messages");
        if (messagesWithThisUser && user && readMessages) 
            readMessages(user.id, window.location.pathname.split("/")[2]);
    }, [messagesWithThisUser, user, readMessages]);

    function sendMessage() {
        socket.emit("message", { content: messageInput, receiver: window.location.pathname.split("/")[2], sender: user.id, type:"CHAT" });
        setMessageInput("");
    };

    return (
        <div>
            {messagesWithThisUser && messagesWithThisUser.map(message =>
                message.type === "NOTIFICATION" ? <div key={message.id} style={{color:"red"}}>{message.content}</div> :
                message.type === "CHAT" ? <div key={message.id}>{message.sender} : {message.content} {message.createdAt}</div> : 
                message.type === "OFFER"? <Offer key={message.id} message={message} user={user}/> : <div>Unknown Message!</div>
            )} 
            <input autoFocus value={messageInput} onChange={(e) => setMessageInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && e.target.value !== "") sendMessage() }} />
            <button onClick={sendMessage}>Send</button>
        </div>
    )
};

function mapStateToProps(state) {
    return {
        user: state.user,
        sortedMessages: state.sortedMessages
    };
};

function mapDispatchToProps(dispatch) {
    return {
        readMessages: (id, othersId) => dispatch({ type: "READ_MESSAGES_ASYNC", id, othersId })
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Message);