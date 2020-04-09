import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import PlaceSearchInput from './PlaceSearchInput';
import WrappedMap from './Map';
import axios from 'axios';

export default function Post(props) {
    
    const [mapCenter, setMapCenter] = useState(undefined); 
    const [address, setAddress] = useState("");
    const [markerPositionForPoster, setMarkerPositionForPoster] = useState(undefined);

    useEffect(()=>navigator.geolocation.getCurrentPosition(position => {
        setMapCenter({lat:position.coords.latitude, lng:position.coords.longitude});
        setMarkerPositionForPoster({lat:position.coords.latitude, lng:position.coords.longitude});
    }),[])
     
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
            <PlaceSearchInput setMapCenter={setMapCenter} setAddress={setAddress} setMarkerPositionForPoster={setMarkerPositionForPoster} />
            <div style={{ height: "50vh", width: "50vh" }}>
                <WrappedMap
                    loadingElement={<div style={{ height: "100%" }} />}
                    containerElement={<div id="map" style={{ height: "100%" }} />}
                    mapElement={<div style={{ height: "100%" }} />}
                    mapCenter={mapCenter}
                    setMapCenter={setMapCenter}
                    forPoster={true}
                    markerPositionForPoster={markerPositionForPoster}
                    setMarkerPositionForPoster={setMarkerPositionForPoster}
                />
            </div>
            <button onClick={()=>axios.post("/api/errands", {title:document.getElementById("titleInput").value,
                                                             description:document.getElementById("descriptionInput").value,
                                                             address, 
                                                             coordinates:JSON.stringify(markerPositionForPoster) })
                                                             .then((res)=>console.log(res)).catch((err)=>console.log(err))
                                                             }>Create New Errand</button>
        </div>
    )

}