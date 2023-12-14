import React from 'react'
import PassengerMap from '../components/PassengerMap';
import { useJsApiLoader, Libraries } from '@react-google-maps/api';
import { useState, useEffect } from 'react'

const libraries: Libraries = ["marker", "places"];
type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;

export default function PassengerNavigating() {

    const [directions, setDirections] = useState<DirectionsResult | undefined>(undefined);
    
        // useJsApiLoader hook to load the Google Maps API
        const { isLoaded } = useJsApiLoader({
            googleMapsApiKey: process.env.REACT_APP_GOOGLEMAP_API_KEY || "",
            version: "beta",
            libraries,
        });


    return 
        <> {isLoaded && (

            <main className="bg-white flex flex-col items-center h-screen w-full">
    
                <div className="relative h-1/2 w-full">
                    <PassengerMap isLoaded={isLoaded} directions={directions} detail={true} />
                </div>
                </main>
                )}
    </>
        
}
