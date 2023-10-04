"use client"
import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectiosRenderer,
} from "@react-google-maps/api";
const axios = require("axios");
import { useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
import Map from "../component/map";
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const containerStyle = {
  width: "100%",
  height: "800px",
};

const NodeTrackerMap = () => {

  const router = usePathname();
  const searchParams = useSearchParams();  
  let nodeID = searchParams.get('nodeId')
  console.log('NodeID = ',nodeID);

  const [path, setPath] = useState([]); // Store the path for the node
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 }); // Center the map at a default location
  

  useEffect(() => {
    const fetchData = () => {
    let data = JSON.stringify({
      nodeId: nodeID,
    });
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}api/getById`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((result) => {
        let response = result.data;
        console.log("2nd Response",response);

        if (response.isAllocated) {
          const trackingData = response.response.tracking;

          console.log("tracking data",trackingData)
          // var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
          // var icons = {
          //     parking:
          //         {
          //           path: google.maps.SymbolPath.CIRCLE,
          //           scale: 10,
          //         },
          //     library: {
          //         icon: iconBase + 'library_maps.png'
          //     },
          //     info: {
          //         icon: iconBase + 'info-i_maps.png'
          //     },
          //     grocery_or_supermarket: {
          //         icon: iconBase + 'convenience.png'
          //     },
          // };
        
          const coordinatesWithGatewayIds = trackingData.map((tracking , index) => ({
            lat: tracking.lat,
            lng: tracking.long,
            gatewayId: tracking.gatewayId,
          }));
          console.log("Coordinates With GatewayIds: ",coordinatesWithGatewayIds);
          setPath(coordinatesWithGatewayIds);
          setMapCenter(
            coordinatesWithGatewayIds[coordinatesWithGatewayIds.length - 1]
          );
        }
        if (response.response.stoppageTime>120){
          let trackingDataLength = response.response.tracking.length;
          let gwyId = response.response.tracking[trackingDataLength-1].gatewayId;
          // alert(`The truck has stopped at gatewayId : ${gwyId} for since ${response.response.stoppageTime} seconds. `)
          const showToast = () => {
            toast.info(`The NodeId: ${response.response.nodeId} has stopped at gatewayId : ${gwyId} since ${response.response.stoppageTime} seconds. ` , {
              position: 'top-right', // You can specify the position (top-left, top-center, top-right, etc.)
              autoClose: 7000, // Auto-close the toast after 3000 milliseconds (3 seconds)
            });
          };
          showToast()

          };
      })
      .catch((error) => {
        console.log("error = ",error.message)
      });
    }
    
      fetchData();
      const intervalId = setInterval(fetchData, 10000);
      // setIntervalSet(true);
      <ToastContainer />

      // Clean up the interval when the component unmounts
      return () => clearInterval(intervalId);
    
  }, []);

  return (
    <>
    <ToastContainer />
    <LoadScript googleMapsApiKey="AIzaSyChOjljCXd7vty2xDgPGSpyjlQgiykkp-c">
        <Map containerStyle={containerStyle} mapCenter={mapCenter} path={path} />
    </LoadScript>
    </>
  );
};

export default NodeTrackerMap;
