import React, { useState } from 'react';
import { GoogleMap, Marker, withGoogleMap } from "react-google-maps";

/* eslint-disable no-undef */
// ??????????????
export default function Map(props) {

  let mapRef;
  let markerRef;
  const WrappedMap = withGoogleMap(() =>
  //todo: try to make map moves and marker is fixed at the center.
    <GoogleMap ref={(ref) => mapRef = ref} center={props.coordinates} zoom={16}>
      <Marker ref={(ref) => markerRef = ref } position={props.coordinates} draggable={true}/>
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
