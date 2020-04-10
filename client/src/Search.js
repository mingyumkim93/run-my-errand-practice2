import React, { useState, useEffect } from 'react';
import PlaceSearchInput from './PlaceSearchInput';
import WrappedMap from './Map';
import { Marker, InfoWindow } from 'react-google-maps'
import axios from 'axios';

export default function Search() {
    const [mapCenter, setMapCenter] = useState(undefined);
    const [errands, setErrands] = useState(undefined);
    const [selectedMarker, setSelectedMarker] = useState(undefined);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => setMapCenter({ lat: position.coords.latitude, lng: position.coords.longitude }));
        axios.get("/api/errands").then(res => setErrands(res.data)).catch(err => console.log(err));
    }, [])

    return (
        <div style={{ margin: "100px" }}>
            <div style={{ height: "50vh", width: "50vh" }}>
                <WrappedMap
                    googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLEMAPS_API_KEY}&libraries=geometry,drawing,places`}
                    loadingElement={<div style={{ height: "100%" }} />}
                    containerElement={<div id="map" style={{ height: "100%" }} />}
                    mapElement={<div style={{ height: "100%" }} />}
                    mapCenter={mapCenter}
                    setMapCenter={setMapCenter}
                >
                    {errands && errands.map(errand => <Marker key={errand.id} position={JSON.parse(errand.coordinates)} onClick={() => setSelectedMarker(errand)} />)}
                    {selectedMarker && <InfoWindow position={JSON.parse(selectedMarker.coordinates)} onCloseClick={() => setSelectedMarker(undefined)}>
                        <div>{selectedMarker.title}</div>
                    </InfoWindow>}
                </WrappedMap>
                <PlaceSearchInput setMapCenter={setMapCenter} />
            </div>
        </div>
    )
}