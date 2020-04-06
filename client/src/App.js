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

function loadGoogleMapsScript(setIsGoogleMapApiReady){
  if(document.getElementById("google-maps-api"))
  setIsGoogleMapApiReady(true);
  else {
    var script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLEMAPS_API_KEY}&libraries=geometry,drawing,places`;
    script.id = "google-maps-api";
    script.onload = setIsGoogleMapApiReady(true);
    document.body.appendChild(script);
  }
};

function checkAuth(setUser,setIsLoggedIn,setIsLoading){
  axios.get("/api/auth").then((res) => {
    if (res.data) {
      setUser({ ...res.data });
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  })
};


export default function App() {
  
  const [user, setUser] = useState({});
  const [isGoogleMapApiReady, setIsGoogleMapApiReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGoogleMapsScript(setIsGoogleMapApiReady);
    checkAuth(setUser,setIsLoggedIn,setIsLoading);
  }, []);

  if (isLoading) return <div><Loading type={"spokes"} color={"#123123"} /> <h1 style={{ textAlign: "center" }}>Loading...</h1></div> //todo: change to better one
  return (
    <div className="App">
      <Router history={history}>
        <MenuBar user={user} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setUser={setUser} />
        <Switch>
          <Route exact path="/" component={Main} />
          <Route path="/signin" component={() =>
            isLoggedIn ?
              <Redirect to="/" />
              : <SignIn setUser={setUser} setIsLoggedIn={setIsLoggedIn} />
          } />
          <Route path="/signup" component={SignUp} />
          <Route path="/search" component={()=><Search isGoogleMapApiReady={isGoogleMapApiReady}/>} />
          <Route path="/post" component={() => <Post isLoggedIn={isLoggedIn} isGoogleMapApiReady={isGoogleMapApiReady} />} />
        </Switch>
      </Router>
    </div>
  );
}

