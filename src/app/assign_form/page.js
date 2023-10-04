"use client"
import React, { useState , useEffect } from 'react';
import axios from 'axios';
import styles from './assign_form.css'
import { useRouter } from "next/navigation";
const dotenv = require('dotenv')
dotenv.config();
// const uri = `${process.env.NEXT_PUBLIC_BASE_URL}api/nodes`;

const MyForm = () => {

  const [truckData, setTruckData] = useState(''); // State for Truck No
  const [truckNo, setTruckNo] = useState('');
  const [nodeID, setNodeID] = useState('');   // State for Node ID
  const [nodeData, setNodeData] = React.useState([]);

  const router = useRouter()


  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}api/nodes?filters[isAllocated][$eq]=false&filters[isActivated][$eq]=true`
    };
    axios
      .request(config)
      .then((response) => {
        setNodeData(response.data.data)
        console.log("node --",nodeData)
      });

      let config2 = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${process.env.NEXT_PUBLIC_BASE_URL}api/trucks`
      };
      axios
        .request(config2)
        .then((response) => {
          setTruckData(response.data.data)
          console.log(truckData)
        });
  }, []);

  const handleTruckNoChange = (event) => {
    setTruckNo(event.target.value);
    console.log({truckNo})
  };

  const handleNodeIDChange = (event) => {
    setNodeID(event.target.value);
  };


  const handleSubmit = (event) => {
    event.preventDefault(); 
    postFormData();
    router.push(`/`)

  };
 
  const postFormData = () => {
    // Define the data object with nodeId and truckId properties
    let data = JSON.stringify({
      "data": {
        "nodeId": Number(nodeID),
        "truckNumber": truckNo
      }
    });
    
  console.log({data})
    // Axios configuration
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}api/saveAllocation`,
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    
    axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      console.log("save_allocation response",response)
    })
    .catch((error) => {
      console.log(error);
    });
  };

  return (
    <div>
      <h1 style={{ fontSize: '24px' }}>Node Allocation Form</h1>
      <form onSubmit={handleSubmit}>
        <label style={{width:'105px', display:'inline-block'}}>  Truck No: </label>
          <select value={truckNo} onChange={handleTruckNoChange}>
  <option value="">Select Truck</option>
  {Array.isArray(truckData) && truckData.map((ele) => (
    <option key={ele.id} value={ele.attributes.number}>
      {ele.attributes.number}
    </option>
  ))}
</select>
        <br />

        <label style={{width:'100px', display:'inline-block'}}> Node ID:  </label>           <select value={nodeID} onChange={handleNodeIDChange} style={{width: '150px'}}>
    <option value="">Select Node ID</option>
    {nodeData?.map((ele) => (
      <>
     {<option key={ele.id} value={ele.attributes.nodeId}>
        {ele.attributes.nodeId}
      </option>}
      </>
    ))}
  </select>
        
        <br />
        
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default MyForm;
