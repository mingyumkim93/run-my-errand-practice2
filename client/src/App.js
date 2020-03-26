import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import MenuBar from './MenuBar';
import Main from './Main';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Search from './Search';
import Post from './Post';

export default function App() {
  //<Map coordinates={coordinates}/>
  //<PlaceSearchinput setCoordinates={setCoordinates}/>
  return (
    <div className="App">
      <Router>  
      <MenuBar/>
        <Switch>
          <Route exact path="/" component={Main}/>
          <Route path="/signin" component={SignIn}/>
          <Route path="/signup" component={SignUp}/>
          <Route path="/search" component={Search}/>
          <Route path="/post" component={Post}/>
        </Switch>
      </Router>
    </div>
  );
}

 