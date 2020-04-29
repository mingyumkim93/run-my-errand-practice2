import React, { useState, useEffect } from "react";
import { Marker, InfoWindow } from "react-google-maps"
import API from "../utils/API";
import history from "../history";
import PlaceSearchInput from "../components/PlaceSearchInput";
import WrappedMap from "../components/Map";

export default function Search() {
    const [mapCenter, setMapCenter] = useState(null);
    const [errands, setErrands] = useState(null);
    const [selectedErrand, setSelectedErrand] = useState(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => setMapCenter({ lat: position.coords.latitude, lng: position.coords.longitude }));
        API.errand.fetchAllErrands().then(res => setErrands(res.data)).catch(err => console.log(err));
    }, []);

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
                    {errands && errands.map(errand => <Marker key={errand.id} position={JSON.parse(errand.coordinates)} onClick={() => setSelectedErrand(errand)} />)}
                    {selectedErrand && <InfoWindow position={JSON.parse(selectedErrand.coordinates)} onCloseClick={() => setSelectedErrand(undefined)}>
                        <div onClick={()=>history.push(`/errand/${selectedErrand.id}`)}>{selectedErrand.title}</div>
                    </InfoWindow>}
                </WrappedMap>
                <PlaceSearchInput setMapCenter={setMapCenter} />
            </div>
        </div>
    );
};