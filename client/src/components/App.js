import React from "react";
import {
  Router,
  Switch,
  Route
} from "react-router-dom";

import history from "../history";
import MenuBar from "./MenuBar";
import Main from "../pages/Main";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Search from "../pages/Search";
import Post from "../pages/Post";
import ErrandDetail from "../pages/ErrandDetail";
import Inbox from "../pages/Inbox";
import Message from "../pages/Message";
import MyErrands from "../pages/MyErrands";

function App() {
  return (
    <div className="App">
      <Router history={history}>
        <MenuBar/>
        <Switch>
          <Route exact path="/" component={Main}/>
          <Route path="/signin" component={SignIn}/>
          <Route path="/signup" component={SignUp}/>
          <Route path="/search" component={Search}/>
          <Route path="/post" component={Post}/>
          <Route path="/errand/:id" component={ErrandDetail}/>
          <Route path="/inbox" component={Inbox}/>
          <Route path="/message/:id" component={Message}/>
          <Route path="/my-errands" component={MyErrands}/>
        </Switch>
      </Router>
    </div>
  );
};

export default App;