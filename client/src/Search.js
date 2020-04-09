import React, { useState, useEffect } from 'react';
import PlaceSearchInput from './PlaceSearchInput';
import WrappedMap from './Map';
import axios from 'axios';

export default function Search(props) {
    const [mapCenter, setMapCenter] = useState(undefined);
    const [errands, setErrands] = useState(undefined);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => setMapCenter({ lat: position.coords.latitude, lng: position.coords.longitude }));
        axios.get("/api/errands").then(res=>setErrands(res.data)).catch(err=>console.log(err));
    }, [])

    if (!props.isGoogleMapApiReady)
        return (
            <div>Loading...</div>
        )

    return (
        <div style={{ margin: "100px" }}>
           <div style={{ height: "50vh", width: "50vh" }}>
                <WrappedMap
                    loadingElement={<div style={{ height: "100%" }} />}
                    containerElement={<div id="map" style={{ height: "100%" }} />}
                    mapElement={<div style={{ height: "100%" }} />}
                    mapCenter={mapCenter}
                    setMapCenter={setMapCenter}
                    errands={errands}
                />
                <PlaceSearchInput setMapCenter={setMapCenter} />
            </div>
        </div>
    )
}