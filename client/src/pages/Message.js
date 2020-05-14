import React, { useState, useEffect } from "react";
import socket from "../utils/socket";
import { connect } from "react-redux";

function Message({ user, sortedMessages, readMessages }) {

    const [messageInput, setMessageInput] = useState("");
    const [messagesWithUser, setMessagesWithUser] = useState(null);

    useEffect(()=>{
        if(sortedMessages)
            setMessagesWithUser(sortedMessages[window.location.pathname.split("/")[2]])
    }, [sortedMessages, setMessagesWithUser]);

    useEffect(() => {
        if (messagesWithUser && user && readMessages) {
            readMessages(user.id, window.location.pathname.split("/")[2])
        }
    }, [messagesWithUser, user, readMessages]);

    function sendMessage() {
        socket.emit("message", { content: messageInput, receiver: window.location.pathname.split("/")[2], sender: user.id });
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