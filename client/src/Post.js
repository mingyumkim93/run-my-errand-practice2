import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import PlaceSearchInput from './PlaceSearchInput';
import WrappedMap from './Map';
import {Marker} from 'react-google-maps';
import axios from 'axios';

export default function Post(props) {
    
    let markerRef;
    const HELSINKI_COORDINATES={lat:60.1699, lng:24.9384};;
    const [mapCenter, setMapCenter] = useState(undefined); 
    const [address, setAddress] = useState("");
    const [markerPosition, setMarkerPosition] = useState(undefined);

    useEffect(()=>navigator.geolocation.getCurrentPosition(position => {
        setMapCenter({lat:position.coords.latitude, lng:position.coords.longitude});
        setMarkerPosition({lat:position.coords.latitude, lng:position.coords.longitude});
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
            <PlaceSearchInput setMapCenter={setMapCenter} setAddress={setAddress} setMarkerPosition={setMarkerPosition} />
            <div style={{ height: "50vh", width: "50vh" }}>
                <WrappedMap
                    loadingElement={<div style={{ height: "100%" }} />}
                    containerElement={<div id="map" style={{ height: "100%" }} />}
                    mapElement={<div style={{ height: "100%" }} />}
                    mapCenter={mapCenter}
                    setMapCenter={setMapCenter}
                >
                    <Marker ref={ref=>markerRef=ref} position={markerPosition || HELSINKI_COORDINATES} draggable={true} onDragEnd={()=>setMarkerPosition(markerRef.getPosition().toJSON())}/>
               </WrappedMap>
            </div>
            <button onClick={()=>axios.post("/api/errands", {title:document.getElementById("titleInput").value,
                                                             description:document.getElementById("descriptionInput").value,
                                                             address, 
                                                             coordinates:JSON.stringify(markerPosition)})
                                                             .then((res)=>console.log(res)).catch((err)=>console.log(err))
                                                             }>Create New Errand</button>
        </div>
    )

}