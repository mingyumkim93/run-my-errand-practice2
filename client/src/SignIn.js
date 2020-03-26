import React from 'react';
import { Link } from 'react-router-dom';

export default function SignIn() {
    
    return(
        <div>
           <input placeholder="ID"></input>
             <input placeholder="Password" type="password"></input>
             <button>Sign in</button>
             <div>First time? Create your account <Link to="/signup">here</Link></div>
        </div>
    )

}