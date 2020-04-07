import React from 'react';
import { GoogleMap, Marker, withGoogleMap } from "react-google-maps";

export default function Map(props) {

  let mapRef;
  let markerRef;
  const WrappedMap = withGoogleMap(() =>
    <GoogleMap ref={(ref) => mapRef = ref} center={props.mapCenter} zoom={16}>
      <Marker ref={(ref) => markerRef = ref } position={props.mapCenter} draggable={true}/>
    </GoogleMap>
  );
 
  return (
    <div style={{ height: "50vh", width: "50vh" }}>
      <WrappedMap
        loadingElement={<div style={{ height: "100%" }} />}
        containerElement={<div id="map" style={{ height: "100%" }} />}
        mapElement={<div style={{ height: "100%" }} />}
      />
    </div>
  )
}
