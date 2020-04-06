import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import PlaceSearchInput from './PlaceSearchInput';
import Map from './Map';

export default function Post(props) {

    const [coordinates, setCoordinates] = useState(undefined);
    if(!props.isLoggedIn)
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
            <input placeholder="Title"></input>
            <input placeholder="Description"></input>
            <PlaceSearchInput setCoordinates={setCoordinates}/>
            { coordinates && <Map coordinates={coordinates} setCoordinates={setCoordinates}/>}
            <button onClick={()=>console.log(coordinates)}>Check coordinates</button>
        </div>
    )

}