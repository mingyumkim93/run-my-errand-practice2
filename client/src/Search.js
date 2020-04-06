import React from 'react';
import Map from './Map';
import PlaceSearchinput from './PlaceSearchInput';


export default function Search(props) {

    const [coordinates, setCoordinates] = React.useState({ lat: 60.1699, lng: 24.9384 });
    if(!props.isGoogleMapApiReady)
    return(
        <div>Loading...</div>
    )

    return (
        <div style={{ margin: "100px" }}>
                <>
                    <Map coordinates={coordinates} />
                    <PlaceSearchinput setCoordinates={setCoordinates} />
                </>
        </div>
    )
}