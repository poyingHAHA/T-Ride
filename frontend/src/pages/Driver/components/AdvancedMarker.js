"use client";
import { useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { useGoogleMap } from "@react-google-maps/api";

// type LatLngLiteral = google.maps.LatLngLiteral;
// type Map = google.maps.Map;
// type AdvancedMarkerElement = google.maps.marker.AdvancedMarkerElement;

// interface MarkerProps {
//   // map: Map;
//   position: LatLngLiteral;
//   children: React.ReactNode;
//   zIndex?: number;
// }

const AdvancedMarker = ({ position, children, onClick }) => {
  const markerRef = useRef();
  const map = useGoogleMap();
  const rootRef = useRef();
  useEffect(() => {
    if (!rootRef.current) {
      const container = document.createElement("div");
      rootRef.current = createRoot(container);
      // eslint-disable-next-line no-undef
      markerRef.current = new google.maps.marker.AdvancedMarkerView({
        position,
        content: container,
      });
    }

    return () => (markerRef.current.map = null);
  }, []);

  useEffect(() => {
    if (!markerRef.current || !rootRef.current) return;
    rootRef.current.render(children);
    markerRef.current.position = position;
    markerRef.current.map = map;
    const listener = markerRef.current.addListener("click", onClick);
    return () => listener.remove();
  }, [map, position, children, onClick]);

  return <></>;
};

export default AdvancedMarker;