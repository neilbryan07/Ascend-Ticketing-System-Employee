import React from 'react'

import Backdrop from '@mui/material/Backdrop';
import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';



const ModalContent = ({ open , handleClose , width='w-4/12' , title ,children , icons = null , isWhite = true }) => {
  return (
    <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
    >
        <div className='flex flex-col items-center h-screen w-full overflow-y-scroll'>
        <div className={`max-[900px]:w-11/12 max-[1366px]:w-7/12 ${width} ${isWhite ? 'bg-white' : 'bg-gray-50'} my-10 rounded p-4`}>

            <div className='w-full flex flex-row items-center justify-between mb-4'>
                
                <div className='flex flex-row gap-2 items-center'>
                    <span className='text-[#12372A] text-xl font-medium font-kodeFont'>{icons}</span>
                    <span className='text-[#12372A] text-lg font-medium font-kodeFont'>{title}</span>
                </div>
          
                <div onClick={ () => handleClose(false) } className='text-[#436850] text-lg font-medium font-kodeFont cursor-pointer hover:text-black'><CloseIcon/></div>

            </div>

            <Divider />

           {children}
        </div>
        </div>
    </Backdrop>
  )
}

export default ModalContent
