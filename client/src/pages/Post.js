import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { Marker } from "react-google-maps";
import API from "../utils/api";
import PlaceSearchInput from "../components/PlaceSearchInput";
import WrappedMap from "../components/Map";
import { connect } from "react-redux";
import history from "../history";

function Post({user}) {
    
    let markerRef;
    const HELSINKI_COORDINATES = {lat:60.1699, lng:24.9384};
    const [mapCenter, setMapCenter] = useState(null); 
    const [markerPosition, setMarkerPosition] = useState(null);
    const [address, setAddress] = useState(null);
    const [title, setTitle] = useState(null);
    const [description, setDescription] = useState(null);
    const [fee, setFee] = useState(null);

    useEffect(() => {
        let mounted = true;
        navigator.geolocation.getCurrentPosition(position => {
            if (mounted) {
                setMapCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
                setMarkerPosition({ lat: position.coords.latitude, lng: position.coords.longitude });
            }
        })
        return () => mounted = false;
    }, []);

    function post() {
        if (title && description && fee && address && markerPosition) {
            API.errand.postErrand({
                title,
                description,
                address,
                coordinates: JSON.stringify(markerPosition),
                poster_id: user.id,
                fee
            })
                .then((res) => history.push("/")).catch((err) => alert(err));
        }
        else
            alert("please fill every input in");
    };

    if(!user)
    {
        alert("login is required!")
        return <Redirect to="/signin"/>
    };
    
    return(
        <div>
            <input placeholder="Title" onChange={(e)=>setTitle(e.target.value)}/>
            <input placeholder="Description" onChange={(e)=>setDescription(e.target.value)}/>
            <input placeholder="Fee" type="number" onChange={(e)=>setFee(e.target.value)}/>
            <PlaceSearchInput setMapCenter={setMapCenter} setAddress={setAddress} setMarkerPosition={setMarkerPosition} />
            <div style={{ height: "50vh", width: "50vh" }}>
                <WrappedMap
                    googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLEMAPS_API_KEY}&libraries=geometry,drawing,places`}
                    loadingElement={<div style={{ height: "100%" }} />}
                    containerElement={<div id="map" style={{ height: "100%" }} />}
                    mapElement={<div style={{ height: "100%" }} />}
                    mapCenter={mapCenter}
                    setMapCenter={setMapCenter}
                >
                    <Marker ref={ref=>markerRef=ref} position={markerPosition || HELSINKI_COORDINATES} draggable={true} onDragEnd={()=>setMarkerPosition(markerRef.getPosition().toJSON())}/>
               </WrappedMap>
            </div>
            <button onClick={()=>{post()}}>Create New Errand</button>
        </div>
    );
};

function mapStateToProps(state){
    return{
        user:state.user
    }
};

export default connect(mapStateToProps)(Post);