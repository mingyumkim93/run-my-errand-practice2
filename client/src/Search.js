import React, { useEffect, useState } from 'react';
import Map from './Map';
import PlaceSearchinput from './PlaceSearchInput';

function loadGoogleMapsTag(callback) {
    var script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLEMAPS_API_KEY}&libraries=geometry,drawing,places`;
    script.id = "google-maps-api";
    script.onload = callback;
    document.body.appendChild(script);
}

export default function Search(props) {
    const [isGoogleMapApiReady, setIsGoogleMapApiReady] = useState(false)
    useEffect(() => {
        loadGoogleMapsTag(function () {
            setIsGoogleMapApiReady(true)
        });
    }, []);

    const [coordinates, setCoordinates] = React.useState({ lat: 60.1699, lng: 24.9384 });

    return (
        <div style={{ margin: "100px" }}>
            {isGoogleMapApiReady &&
                <>
                    <Map coordinates={coordinates} />
                    <PlaceSearchinput setCoordinates={setCoordinates} />
                </>
            }
            {!isGoogleMapApiReady &&
                <div>
                    loading..
                <button onClick={() => console.log(document.getElementById("google-maps-api"))}>asd</button>
                </div>}
        </div>
    )
}