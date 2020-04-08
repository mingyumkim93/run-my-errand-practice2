import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import PlaceSearchInput from './PlaceSearchInput';
import Map from './Map';
import axios from 'axios';

export default function Post(props) {
    
    // if I find out why map is refreshing when state here changes, I can improve it a lot.
    const [mapCenter, setMapCenter] = useState(undefined); 
    const [address, setAddress] = useState("");
    useEffect(()=>navigator.geolocation.getCurrentPosition(position => setMapCenter({lat:position.coords.latitude, lng:position.coords.longitude})),[])
     
    if(!props.user)
    {
        alert("login is required!")
        return <Redirect to="/signin"/>
    }

    if(!props.isGoogleMapApiReady)
    return(
        <div>Loading...</div>
    )
    
    return(
        <div>
            <input placeholder="Title" id="titleInput"/>
            <input placeholder="Description" id="descriptionInput"/>
            <PlaceSearchInput setMapCenter={setMapCenter} setAddress={setAddress}/>
            { mapCenter && <Map mapCenter={mapCenter} setMapCenter={setMapCenter}/>}
            <button onClick={()=>axios.post("/api/errands", {title:document.getElementById("titleInput").value,
                                                             description:document.getElementById("descriptionInput").value,
                                                             address, 
                                                             coordinates:JSON.stringify(mapCenter) })
                                                             .then((res)=>console.log(res)).catch((err)=>console.log(err))
                                                             }>Create New Errand</button>
        </div>
    )

}