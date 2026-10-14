import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import CircularProgress from '@mui/material/CircularProgress';

const Splash = () => {

    const navigate = useNavigate();
    
    useEffect(() => {

        if(localStorage.getItem('access_token') === null) {
            navigate("/login")
        } else {
            navigate("/app/ticket")
        }

    }, []);

  return (
    <div className='w-full h-screen flex flex-col items-center justify-center bg-gray-200'>
      <div className='flex flex-col items-center'>
        <CircularProgress color="success" />
        <span className='mt-2 font-bold text-green-600 text-lg'>LOADING PAGE</span>
        <span className='font-small text-green-600 text-xs'>NextBPO Solutions</span>
      </div>
    </div>
  )
}

export default Splash
