import React, { useState, useEffect } from "react";
import socket from "../utils/socket";
import { connect } from "react-redux";

function Message({ user, messages, readMessages }) {

    const [messageInput, setMessageInput] = useState("");
    const [messagesWithUser, setMessagesWithUser] = useState(null);
    const [sortedMessages, setSortedMessages] = useState(null);

    //TODO : same code for getting sortedMessages in Inbox component
    useEffect(()=>{
        if(messages && user){
            let sortedMessages = {};
            messages.forEach(message => {
                      // if the message is sent to me
                      if (message.sender !== user.id) {
                        // first message with this user
                        if (!sortedMessages[message.sender]) {
                          sortedMessages = { ...sortedMessages, [message.sender]: [message] };
                        }
                        else {
                          sortedMessages[message.sender].push(message);
                        }
                      }
                      // if the message is sent by me
                      else {
                        if (!sortedMessages[message.receiver]) {
                          sortedMessages = { ...sortedMessages, [message.receiver]: [message] };
                        }
                        else {
                          sortedMessages[message.receiver].push(message);
                        }
                      }
                    });
            setSortedMessages(sortedMessages);
    }},[messages, user]);

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
        messages: state.messages
    };
};

function mapDispatchToProps(dispatch) {
    return {
        readMessages: (id, othersId) => dispatch({ type: "READ_MESSAGES_ASYNC", id, othersId })
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Message);