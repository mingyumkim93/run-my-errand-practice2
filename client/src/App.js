import React, { useEffect, useState } from 'react';
import {
  Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import history from './history';
import axios from 'axios';

import MenuBar from './MenuBar';
import Main from './Main';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Search from './Search';
import Post from './Post';
import Loading from './Loading';
import ErrandDetail from './ErrandDetail'
import socketIOClient from 'socket.io-client';

export default function App() {
  
  const [user, setUser] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);

  function checkAuth(){
    axios.get("/api/auth").then((res) => {
      if (res.data) {
        setUser(res.data);
      }
      setIsLoading(false);
    })
  };

  useEffect(() => {
    checkAuth(setUser,setIsLoading);
    const socket = socketIOClient("http://127.0.0.1:5000");
    socket.on("test", data => console.log(data));
    // to send to server, I guess I need to use socket.emit() (socket.on() in server)
  }, []);

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
          <Route path="/search" component={Search} />
          <Route path="/post" component={() => <Post user={user}/>} />
          <Route path="/errand/:id" component={ErrandDetail}/>
        </Switch>
      </Router>
    </div>
  );
}

