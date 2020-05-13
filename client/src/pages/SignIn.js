import React, { useState } from "react";
import API from "../utils/API";
import history from "../history";
import { connect } from "react-redux";

function SignIn({signIn}) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    return (
        <div>
            <input placeholder="ID" onChange={(e) => setEmail(e.target.value)}></input>
            <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)}></input>
            <button onClick={() => signIn(email, password)}>Sign in</button>
            <button onClick={() => {
                window.open("http://localhost:5000/auth/google", "_self");
            }}>login with google</button>
            <div>First time? Create your account <button onClick={()=>history.push("/signup")}>here</button></div>
        </div>
    );
};

function mapDispatchToProps(dispatch){
    return{
        signIn: (email, password) => dispatch({type:"SIGN_IN_ASYNC", payload:{email, password}})
    }
};

export default connect(null, mapDispatchToProps)(SignIn);