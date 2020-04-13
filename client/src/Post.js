import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import PlaceSearchInput from './PlaceSearchInput';
import WrappedMap from './Map';
import { Marker } from 'react-google-maps';
import axios from 'axios';

export default function Post(props) {
    
    let markerRef;
    const HELSINKI_COORDINATES = {lat:60.1699, lng:24.9384};
    const [mapCenter, setMapCenter] = useState(undefined); 
    const [markerPosition, setMarkerPosition] = useState(undefined);
    const [address, setAddress] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
     
    
    useEffect(() => {
        let mounted = true;
        navigator.geolocation.getCurrentPosition(position => {
            if (mounted) {
                setMapCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
                setMarkerPosition({ lat: position.coords.latitude, lng: position.coords.longitude });
            }
        })
        return () => mounted = false;
    }, [])

    if(!props.user)
    {
        alert("login is required!")
        return <Redirect to="/signin"/>
    }
    
    return(
        <div>
            <input placeholder="Title" onChange={(e)=>setTitle(e.target.value)}/>
            <input placeholder="Description" onChange={(e)=>setDescription(e.target.value)}/>
            <PlaceSearchInput setMapCenter={setMapCenter} setAddress={setAddress} setMarkerPosition={setMarkerPosition} />
            <div style={{ height: "50vh", width: "50vh" }}>
                <WrappedMap
                    googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLEMAPS_API_KEY}&libraries=geometry,drawing,places`}
                    loadingElement={<div style={{ height: "100%" }} />}
                    containerElement={<div id="map" style={{ height: "100%" }} />}
                    mapElement={<div style={{ height: "100%" }} />}
                    mapCenter={mapCenter}
                    setMapCenter={setMapCenter}
                >
                    <Marker ref={ref=>markerRef=ref} position={markerPosition || HELSINKI_COORDINATES} draggable={true} onDragEnd={()=>setMarkerPosition(markerRef.getPosition().toJSON())}/>
               </WrappedMap>
            </div>
            <button onClick={()=>axios.post("/api/errands", {title,
                                                             description,
                                                             address, 
                                                             coordinates:JSON.stringify(markerPosition),
                                                             poster:props.user.email},)
                                                             .then((res)=>console.log(res)).catch((err)=>console.log(err))
                                                             }>Create New Errand</button>
        </div>
    )

}