import React, { useEffect, useState } from "react";
import history from "../history";
import { connect } from "react-redux";
import socket from "../utils/socket";
import { actionCreators } from "../store";

function MenuBar({ user, signOut, messages, authCheck, addMessage }) {

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
  }, [messages, user]);

  useEffect(() => {
    if (user && addMessage) {
      socket.emit("join", user.id);
      socket.on("message", (message) => addMessage(message[0]));
      socket.on("message-error", () => { alert("something went wrong with message") });
    }
  }, [user, addMessage])

  const onMenuHover = (e) => {
    e.target.parentElement.querySelector("div").style.display = ""
  };

  const onMenuLeave = () => {
    const menuItems = document.getElementsByClassName("dropdown-menu-item");
    for (var index = 0; index < menuItems.length; ++index)
      menuItems[index].style.display = "none"
  };

  return (
    <div style={{ borderBottom: "1px solid black", display: "flex", flexDirection: "row", height: "3em", cursor: "pointer" }}>
      <div style={{ flexBasis: "150px" }}><button onClick={() => history.push("/")}>Logo</button></div>
      <div className="dropdown-menu" style={{ flexBasis: "150px" }} onMouseLeave={() => onMenuLeave()}>
        <button onClick={() => history.push("/search")} onMouseOver={(e) => onMenuHover(e)} >For Runner</button>
        <div className="dropdown-menu-item" style={{ display: "none", position: "absolute", backgroundColor: "white" }}>
          <button onClick={() => history.push("/search")}>Search</button>
          <div>My errand</div>
        </div>
      </div>
      <div className="dropdown-menu" style={{ flexBasis: "150px" }} onMouseLeave={() => onMenuLeave()}>
        <button onClick={() => history.push("/post")} onMouseOver={(e) => onMenuHover(e)}>For Poster</button>
        <div className="dropdown-menu-item" style={{ display: "none", position: "absolute", backgroundColor: "white" }}>
          <button onClick={() => history.push("/post")} >Post</button>
          <div>My errand</div>
          <div>item C</div>
        </div>
      </div>
      {unreadMessages ? <div onClick={() => history.push("/inbox")} style={{ flexBasis: "100px", marginLeft: "auto" }}>Message{unreadMessages.length}</div> :
        <div style={{ flexBasis: "100px", marginLeft: "auto" }}></div>}
      {user ? <div style={{ flexBasis: "100px", marginLeft: "auto" }}>Welcome {user.firstname}</div> :
        <div style={{ flexBasis: "100px", marginLeft: "auto" }}></div>}
      <div style={{ flexBasis: "100px" }}>
        {user ? <div onClick={() => signOut()}>Sign out</div>
          : <button onClick={() => history.push("/signin")}>Sign in</button>}
      </div>
    </div>
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
    addMessage: (message) => dispatch(actionCreators.addMessage(message))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuBar);