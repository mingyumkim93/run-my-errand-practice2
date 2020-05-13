import React from "react";
import { connect } from "react-redux";

function Main({user}) {

    return (
        <div id="main">
            <button onClick={()=>console.log(user)}>Check user</button>
            Description and introduction about this application
        </div>
    );
};

function mapStateToProps(state){
    return {user: state.user}
}
export default connect(mapStateToProps)(Main);