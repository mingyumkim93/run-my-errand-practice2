import React, { useEffect, useState } from "react";
import history from "../history";
import { connect } from "react-redux";
import socket from "../utils/socket";
import { actionCreators } from "../store";

function MenuBar({ user, signOut, messages, authCheck, addMessage, sortMessages }) {

  const [unreadMessages, setUnreadMessages] = useState(null);

  useEffect(() => {
    authCheck();
  }, [authCheck]);

  useEffect(() => {
    function countUnreadMessages() {
      const messagesSentToMe = messages.filter(message => message.receiver === user.id);
      const unreadMessages = messagesSentToMe.filter(message => message.isRead === 0);
      setUnreadMessages(unreadMessages);
    };

    if (messages && user) {
      countUnreadMessages()
    }

    if(!user) setUnreadMessages(null);
  }, [messages, user]);

  useEffect(() => {
    if (user && addMessage) {
      socket.emit("join", user.id);
      socket.on("message", (message) => addMessage(message[0]));
      socket.on("message-error", () => alert("something went wrong with message"));
    }
  }, [user, addMessage]);

  useEffect(()=>{
    if(messages && sortMessages && user){
      sortMessages(user.id)
    }
  }, [messages, sortMessages, user]);

  return (
    <>
      <span onClick={() => history.push("/")}>LOGO</span>
      <span style={{marginLeft:"50px"}} onClick={() => history.push("/search")}>For Runner</span>
      <span style={{marginLeft:"50px"}} onClick={() => history.push("/post")}>For Poster</span>
      {unreadMessages ? <span style={{marginLeft:"50px"}} onClick={() => history.push("/inbox")}>Inbox{unreadMessages.length}</span> : <></>}
      {user ? <span style={{marginLeft:"50px"}} onClick={() => signOut()}>Sign out</span> : <span style={{marginLeft:"50px"}} onClick={() => history.push("/signin")}>Sign in</span>}
    </>
  );
};

function mapStateToProps(state) {
  return {
    user: state.user,
    messages: state.messages
  }
};

function mapDispatchToProps(dispatch) {
  return {
    signOut: () => dispatch({ type: "SIGN_OUT_ASYNC" }),
    authCheck: () => dispatch({ type: "AUTH_CHECK_ASYNC" }),
    addMessage: (message) => dispatch(actionCreators.addMessage(message)),
    sortMessages: (id) => dispatch(actionCreators.sortMessages(id))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuBar);