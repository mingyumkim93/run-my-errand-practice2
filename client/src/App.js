import React ,{useEffect, useState} from 'react';
import {
  Router,
  Switch,
  Route
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

export default function App() { 
  const [user, setUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/auth").then((res) => {
      if (res.data) {
        setUser({ ...res.data });
        setIsLoggedIn(true);
        setIsLoading(false);
      }
      else setIsLoading(false);
    })
  }, []);

  if(isLoading) return <div><Loading type={"spokes"} color={"#123123"}/> <h1 style={{textAlign:"center"}}>Loading...</h1></div> //todo: change to better one
  return (
    <div className="App">
      <Router history={history}>  
      <MenuBar user={user} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setUser={setUser}/>
        <Switch>
          <Route exact path="/" component={Main}/>
          <Route path="/signin" component={()=> <SignIn setUser={setUser} setIsLoggedIn={setIsLoggedIn}/>} />
          <Route path="/signup" component={SignUp}/>
          <Route path="/search" component={Search}/>
          <Route path="/post" component={Post}/>
        </Switch>
      </Router>
    </div>
  );
}

 