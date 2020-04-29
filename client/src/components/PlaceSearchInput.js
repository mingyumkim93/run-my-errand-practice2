import React, { useState } from "react";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";

export default function PlaceSearchinput(props) {
    const [addressInput, setAddressInput] = useState("");
    const handleSelect = async value => {
        const results = await geocodeByAddress(value);
        const latLng = await getLatLng(results[0]);
        props.setMapCenter(latLng);
        if(props.setMarkerPosition)props.setMarkerPosition(latLng)
        if(props.setAddress)props.setAddress(value);
    };

    return (
    <input placeholder="Enter full address" onChange={(e)=>setAddressInput(e.target.value)} onBlur={()=>handleSelect(addressInput)} onKeyDown={(e)=>{if(e.key==="Enter")e.target.blur()}}/>
    );
    
};
