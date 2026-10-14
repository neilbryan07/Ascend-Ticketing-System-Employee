import React from 'react'
import { Link, useNavigate , useLocation } from "react-router-dom";
const SideBarLinks = ({children , anchortags }) => {
      
  const navigate = useNavigate();

  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div onClick={ anchortags ? () => navigate(anchortags) : null } 
    className={`w-full flex flex-row gap-5 items-center py-2 px-2 ${ anchortags === pathname ? 'bg-[#ADBC9F] text-white' : null }  cursor-pointer hover:bg-[#ADBC9F] rounded
    transition duration-1500 ease-out hover:text-white text-black`}>
      {children}
    </div>
  )
}

export default SideBarLinks
