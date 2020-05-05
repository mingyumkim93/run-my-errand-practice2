import React, { useEffect, useState } from "react";
import {
  Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import history from "../history";
import API from "../utils/API";
import socket from "../utils/socket";

import MenuBar from "./MenuBar";
import Main from "../pages/Main";
import Loading from "../Loading";

import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Search from "../pages/Search";
import Post from "../pages/Post";
import ErrandDetail from "../pages/ErrandDetail";
import Inbox from "../pages/Inbox";
import Message from "../pages/Message";

export default function App() {
  
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  function checkAuth(){
    API.auth.check().then((res) => {
      if (res.data) {
        setUser(res.data);
      }
      setIsLoading(false);
    });
  };

  function fetchMesages(){
    // fetch messages that is sent to me or I sent to somebody 
    API.message.fetchMessages(user.id).then(res=> setMessages(res.data)).catch(err => alert("therer was error on fetching messages", err));
  }

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(()=> {
    // if user loged in
    if(user){
      fetchMesages();
      socket.emit("join", user.id);
      socket.on("message", (message) => setMessages({...messages, message}));
    };
  }, [user]);

  if (isLoading) return <div><Loading type={"spokes"} color={"#123123"} /> <h1 style={{ textAlign: "center" }}>Loading...</h1></div> //todo: change to better one
  return (
    <div className="App">
      <Router history={history}>
        <MenuBar user={user} setUser={setUser}/>
        <Switch>
          <Route exact path="/" component={Main} />
          <Route path="/signin" component={() =>
            user ?
              <Redirect to="/" />
              : <SignIn setUser={setUser}/>
          } />
          <Route path="/signup" component={SignUp} />
          <Route path="/search" component={Search}/>
          <Route path="/post" component={() => <Post user={user}/>} />
          <Route path="/errand/:id" component={ErrandDetail}/>
          <Route path="/Inbox" component={() => <Inbox user={user} messages={messages}/>}/>
          <Route path="/message/:id" component={() => <Message user={user}/>}/>
        </Switch>
      </Router>
    </div>
  );
};

