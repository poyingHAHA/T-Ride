"use client";
import { FC, useRef, useEffect } from "react";
import { createRoot, Root } from "react-dom/client";
import { useGoogleMap } from "@react-google-maps/api";

type LatLngLiteral = google.maps.LatLngLiteral;
type Map = google.maps.Map;
type AdvancedMarkerElement = google.maps.marker.AdvancedMarkerElement;

interface MarkerProps {
  map: Map;
  position: LatLngLiteral;
  children: React.ReactNode;
}

const AdvancedMarker: FC<MarkerProps> = ({ position, children }) => {
  const markerRef = useRef<AdvancedMarkerElement>();
  const map = useGoogleMap();
  const rootRef = useRef<Root>();
  useEffect(() => {
    if (!rootRef.current) {
      const container = document.createElement("div");
      rootRef.current = createRoot(container);
      markerRef.current = new google.maps.marker.AdvancedMarkerElement({
        position,
        content: container,
      });
    }
  }, []);

  useEffect(() => {
    if (!markerRef.current || !rootRef.current) return;
    rootRef.current.render(children);
    markerRef.current.position = position;
    markerRef.current.map = map;
  }, [map, position, children]);

  return <></>;
};

export default AdvancedMarker;