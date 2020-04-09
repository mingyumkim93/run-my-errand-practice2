import React, { useState } from 'react';
import { GoogleMap, withGoogleMap, Marker, InfoWindow} from "react-google-maps";

function Map(props) {
  let mapRef;
  let markerRef;
  const { mapCenter, setMapCenter, errands, forPoster, markerPositionForPoster, setMarkerPositionForPoster } = props;
  const [selectedMarker, setSelectedMarker] = useState(undefined);
  return (
      <div>
      <GoogleMap ref={ref=>mapRef=ref} defaultZoom={10} center={mapCenter || {lat:60.1699, lng:24.9384}} onDragEnd={()=>setMapCenter(mapRef.getCenter().toJSON())}>
          {errands && errands.map(errand=><Marker key={errand.id} position={JSON.parse(errand.coordinates)} onClick={()=>setSelectedMarker(errand)}/>)}
          {selectedMarker && <InfoWindow position={JSON.parse(selectedMarker.coordinates)} onCloseClick={()=>setSelectedMarker(undefined)}>
                      <div>{selectedMarker.title}</div>
              </InfoWindow>}
          {forPoster && <Marker ref={ref=>markerRef=ref} position={markerPositionForPoster || {lat:60.1699, lng:24.9384}} draggable={true} onDragEnd={()=>setMarkerPositionForPoster(markerRef.getPosition().toJSON())} />}
      </GoogleMap>
      </div>
  )
}
const WrappedMap = withGoogleMap(Map);
export default WrappedMap
