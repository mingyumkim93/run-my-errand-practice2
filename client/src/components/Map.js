import React from "react";
import { GoogleMap, withGoogleMap, withScriptjs } from "react-google-maps";

function Map(props) {
    const {mapCenter, setMapCenter} = props
    const HELSINKI_COORDINATES = {lat:60.1699, lng:24.9384};
    let mapRef;
  return (
      <GoogleMap ref={ref=>mapRef=ref} defaultZoom={10} center={mapCenter || HELSINKI_COORDINATES} onDragEnd={()=>setMapCenter(mapRef.getCenter().toJSON())}>
        {props.children}
      </GoogleMap>
  );
};
const WrappedMap = withScriptjs(withGoogleMap(Map));
export default WrappedMap;
