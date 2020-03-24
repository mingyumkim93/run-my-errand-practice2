import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import MenuBar from './MenuBar';
import Main from './Main';
import SignIn from './SignIn';
import SignUp from './SignUp';

 
export default function App() {
  const [coordinates, setCoordinates] = React.useState({lat: 60.1699, lng: 24.9384});
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
        </Switch>
      </Router>
    </div>
  );
}

 