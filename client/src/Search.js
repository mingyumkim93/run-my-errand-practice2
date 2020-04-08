import React, {useState, useEffect} from 'react';
import Map from './Map';
import PlaceSearchinput from './PlaceSearchInput';
import {Marker, InfoWindow} from 'react-google-maps';
import axios from 'axios';


export default function Search(props) {

    const [errands, setErrands] = useState([]);
    const [mapCenter, setMapCenter] = useState(undefined); 
    const [selectedMarker, setSelectedMarker] = useState(undefined);
    useEffect(()=>{
        axios.get("/api/errands").then(res=>setErrands(res.data)).catch(err=>console.log(err));
        navigator.geolocation.getCurrentPosition(position => setMapCenter({lat:position.coords.latitude, lng:position.coords.longitude}));
    },[])

    if(!props.isGoogleMapApiReady)
    return(
        <div>Loading...</div>
    )

    return (
        <div style={{ margin: "100px" }}>
                <>
                    <Map mapCenter={mapCenter} >
                        {errands && errands.map(errand=><Marker key={errand.id} position={JSON.parse(errand.coordinates)} onClick={()=>setSelectedMarker(errand)}/>)}
                    </Map>
                    <PlaceSearchinput setMapCenter={setMapCenter} />
                </>
        </div>
    )
}