import React from "react";
import { connect } from "react-redux";

function Main({user, messages}) {

    return (
        <div id="main">
            <button onClick={()=>console.log(user)}>Check user</button>
            <button onClick={()=>console.log(messages)}>Check messages</button>
            Description and introduction about this application
        </div>
    );
};

function mapStateToProps(state){
    return {user: state.user, messages: state.messages}
}
export default connect(mapStateToProps)(Main);