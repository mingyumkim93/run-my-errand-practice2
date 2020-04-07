import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import PlaceSearchInput from './PlaceSearchInput';
import Map from './Map';

export default function Post(props) {
    
    const [mapCenter, setMapCenter] = useState(undefined); 
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
            <input placeholder="Title" id="titleInput"></input>
            <input placeholder="Description" id="descriptionInput"></input>
            <PlaceSearchInput setMapCenter={setMapCenter}/>
            { mapCenter && <Map mapCenter={mapCenter} />}
            {/* <button onClick={()=>console.log(mapCenter, document.getElementById("titleInput").value, document.getElementById("descriptionInput").value) }>asd</button> */}
        </div>
    )

}