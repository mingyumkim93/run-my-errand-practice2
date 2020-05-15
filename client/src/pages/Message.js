import React, { useState, useEffect } from "react";
import socket from "../utils/socket";
import { connect } from "react-redux";

function Message({ user, sortedMessages, readMessages }) {

    const [messageInput, setMessageInput] = useState("");
    const [messagesWithThisUser, setMessagesWithThisUser] = useState(null);

    useEffect(()=>{
        //render happens twice when user receive message (but not with sending)
        if(sortedMessages)
            setMessagesWithThisUser(sortedMessages[window.location.pathname.split("/")[2]]);
    }, [sortedMessages, setMessagesWithThisUser]);

    useEffect(() => {
        if (messagesWithThisUser && user && readMessages) 
            readMessages(user.id, window.location.pathname.split("/")[2]);
    }, [messagesWithThisUser, user, readMessages]);

    function sendMessage() {
        socket.emit("message", { content: messageInput, receiver: window.location.pathname.split("/")[2], sender: user.id, type:"CHAT" });
        setMessageInput("");
    };

    return (
        <div>Message
            {messagesWithThisUser && messagesWithThisUser.map(message =>
                <div key={message.id}>{message.sender} : {message.content} {message.createdAt}</div>
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