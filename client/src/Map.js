import React from 'react';
import { GoogleMap, Marker, withGoogleMap } from "react-google-maps";

/* eslint-disable no-undef */
// ??????????????
export default function Map(props) {

  const WrappedMap = withGoogleMap((props) =>
    <GoogleMap center={props.latlng} zoom={16}>
      <Marker position={{ lat: 60.1699, lng: 24.9384 }} />
    </GoogleMap>
  );

  return (
    <div style={{ height: "50vh", width: "50vh" }}>
      <WrappedMap
        loadingElement={<div style={{ height: "100%" }} />}
        containerElement={<div id="map" style={{ height: "100%" }} />}
        mapElement={<div style={{ height: "100%" }} />}
        latlng={props.coordinates}
      />
    </div>
  )

}
