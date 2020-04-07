import React from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";

export default function PlaceSearchinput(props) {
    const [address, setAddress] = React.useState("");
    const handleSelect = async value => {
        const results = await geocodeByAddress(value);
        const latLng = await getLatLng(results[0]);
        props.setMapCenter(latLng);
    };

    return (
    <PlacesAutocomplete value={address} onChange={setAddress} onSelect={handleSelect}>
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) =>
            (<div>
                <input {...getInputProps({ placeholder: "Type address" })} />
                <div> 
                    {loading ? <div>...loading</div> : null}
                    {suggestions.map(suggestion => {
                        const style = { backgroundColor: suggestion.active ? "#f5429e" : "#fff" }
                        return <div {...getSuggestionItemProps(suggestion, { style })}>{suggestion.description}</div>;
                    })}
                </div>
            </div>
            )}
    </PlacesAutocomplete>
    )

}
