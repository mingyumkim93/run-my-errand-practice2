import React from 'react';
import axios from 'axios';

export default function Main() {

    return (
        <div id="main">
            Description and introduction about this application
            <button onClick={()=>axios.get('/api/auth').then((res)=>console.log(res))}>Auth Test</button>
        </div>
    )
}
