import { GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api";
import React, { useEffect, useState } from "react";
import img from "../tower.png"

export default function map(props) {
  const [directions, setDirections] = useState([]); // Store the directions data for each segment
  const renderDirections = () => {
    if (props.path.length < 2) {
      return;
    }

    // const waypoints = path.map((coordinate) => ({
    //   location: new window.google.maps.LatLng(coordinate.lat, coordinate.lng),
    // }));

    const segmentDirections = [];
    for (let i = 0; i < props.path.length - 1; i++) {
      const segment = props.path.slice(i, i + 2);
      const directionsRequest = {
        origin: segment[0],
        // origin: waypoints[0].location,
        destination: segment[1],

        // destination: waypoints[waypoints.length - 1].location,
        // waypoints: waypoints.slice(1, waypoints.length - 1),
        optimizeWaypoints: true,
        travelMode: "DRIVING",
      };
      try {
        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route(directionsRequest, (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            segmentDirections.push(result);
            // If we have directions for all segments, update the state
            if (segmentDirections.length === props.path.length - 1) {
              setDirections(segmentDirections);
            }
          } else {
            console.error("Error rendering directions:", status);
          }
        });
      } catch (error) {
        console.error("An error occurred while rendering directions:", error);
      }
    }
  };

  

  return (
    <GoogleMap
      mapContainerStyle={props.containerStyle}
      center={props.mapCenter}
      zoom={10}
    >
      {props?.path?.map((coordinate, index) => (
        <>
          {" "}
          {coordinate.lat > 0 && coordinate.lng > 0 && (
            <Marker
              key={index}
              icon={
                index == 0
                  ? ""
                  : ``
              }
              position={{ lat: coordinate.lat, lng: coordinate.lng }}
              label={`Gateway ID: ${coordinate.gatewayId}`}
            />
          )}
        </>
      ))}

      {directions.map((segmentDirections, index) => (
        <DirectionsRenderer
          key={index}
          directions={segmentDirections}
          options={{
            suppressMarkers: true,
            preserveViewport: true,
          }}
        />
      ))}

      {props.path.length > 1 && renderDirections()}
    </GoogleMap>
  );
}
