import React, { useEffect, useState } from 'react';
import axios from 'axios';
export default function ErrandDetail(props) {

    const [ errand, SetErrand ] = useState(undefined);
    useEffect(() => {
        async function fetchErrand(){
            await axios.get(`/api/errand/${props.match.params.id}`).then(res=>{
                if(res.data.length===0)
                    alert("not exist");
                SetErrand(res.data[0])}).catch(err=>alert("Something went wrong!", err));
        }
        fetchErrand();
    },[]);
    if (errand === undefined)
    return( <div> loading...</div>)
    return (
        <div>
            <div>ErrandDetail</div>
            <div>{errand.id}</div>
            <div>{errand.title}</div>
            <div>{errand.description}</div>
        </div>
    )
}