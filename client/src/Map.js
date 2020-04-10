import React from 'react';
import { GoogleMap, withGoogleMap } from "react-google-maps";

function Map(props) {
    const { mapCenter, setMapCenter } = props
    const HELSINKI_COORDINATES={lat:60.1699, lng:24.9384};
    let mapRef;
  return (
      <div>
      <GoogleMap ref={ref=>mapRef=ref} defaultZoom={10} center={mapCenter || HELSINKI_COORDINATES} onDragEnd={()=>setMapCenter(mapRef.getCenter().toJSON())}>
        {props.children}
      </GoogleMap>
      </div>
  )
}
const WrappedMap = withGoogleMap(Map);
export default WrappedMap
