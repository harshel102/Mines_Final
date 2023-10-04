"use client"
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
const dotenv = require('dotenv')
dotenv.config();
// const uri = `${process.env.NEXT_PUBLIC_BASE_URL}api/nodes`;

const nodestatus = () => {
  const [nodeData, setNodeData] = React.useState([]);
  const router = useRouter();

  const handleClick = (nodeId) => {
    console.log({ nodeId });
    router.push(`node-status/?nodeId=${nodeId}`)
  };

  const goToAssignform = () => {
    router.push(`/assign_form`)
  };

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}api/nodes?sort=nodeId`
    };

    axios
      .request(config)
      .then((response) => {
        console.log("nodestatus response",response);
        setNodeData(response.data.data);const searchParams = useSearchParams();  
        let nodeID = searchParams.get('nodeId')
        console.log('NodeID = ',nodeID);
        console.log("error", error.message);
       
      });
  }, []);

 

  return (
    <>
      <table style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid black", fontSize: 20 }}>Node Id</th>
            <th style={{ border: "1px solid black", fontSize: 20 }}>Allocation</th>
            <th style={{ border: "1px solid black", fontSize: 20 }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {nodeData?.map((item, index) => (
            <tr style={{ border: "1px solid black" }} key={index}>
              <td
              className="hover-td"
                style={{ border: "1px solid black" , cursor:'pointer' }}
                onClick={()=>
                  {
                    (item.attributes.isAllocated) ? handleClick(item.attributes.nodeId) : alert("Node is not connected to any Truck");
                  }
                  }   
              >
                {item.attributes.nodeId}
              </td>
              {item.attributes.isAllocated ? <td> ✅</td> : <td> ❌</td>}
              {item.attributes.isActivated ? <td style={{ border: "1px solid black" }}> ✅</td> : <td style={{ border: "1px solid black" }}> ❌</td>}
              
            </tr>
          ))}

          

        </tbody>
      </table>
      <div>        
        <button type="button" 
        style={{cursor:"pointer" , backgroundColor:"green" , width:"200px" , height:"50px" , fontSize:"20px" , border:'0px' , borderRadius:5 , marginTop:"20px"}}
        onClick={()=> goToAssignform()} 
        >
          Assign Node </button> 
      </div>
    </>
  );
}

export default nodestatus;