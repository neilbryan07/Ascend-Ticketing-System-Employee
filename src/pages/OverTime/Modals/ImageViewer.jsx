import React , { useState , useEffect} from 'react'

import { IoSendOutline , IoTicketOutline } from "react-icons/io5";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import ModalContent from '../../../component/Modal/ModalContent';

import { HiOutlineZoomIn, HiOutlineZoomOut } from "react-icons/hi";
import { RiCloseCircleFill } from "react-icons/ri";

import { DefaultUploadPathTickets , DefaultUploadPathLeave , DefaultUploadPathOverTime } from '../../../contants';

const ImageViewer = ({ ImageView , ModalToggle , Toggle , isLeave = false }) => {

  return (
    <ModalContent 
        icons={<IoTicketOutline/>}
        open={Toggle} 
        handleClose={ModalToggle} 
        title={"View Image"}
        width='w-6/12'
    >
 
      <TransformWrapper
        initialScale={1}
        initialPositionX={200}
        initialPositionY={100}
        centerOnInit={true}
      >
        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
          <React.Fragment>

              <div className="tools flex flex-row gap-6 justify-center my-3">
                <button className='bg-green-400 px-5 py-1 flex items-center text-xl rounded-lg text-black' onClick={() => zoomIn()}><HiOutlineZoomIn/></button>
                <button className='bg-green-400 px-5 py-1 flex items-center text-xl rounded-lg text-black' onClick={() => zoomOut()}><HiOutlineZoomOut/></button>
                <button className='bg-green-400 px-5 py-1 flex items-center text-xl rounded-lg text-black' onClick={() => resetTransform()}><RiCloseCircleFill/></button>
              </div>

              <div className='px-4 py-3 drop-shadow-xl bg-gray-200 flex items-center justify-center'>
                <div className='bg-white rounded-lg'>
                  <TransformComponent>
                    <img src={`${ DefaultUploadPathOverTime }/${ImageView}`}/>
                  </TransformComponent>
                </div>
              </div>

          </React.Fragment>
        )}
      </TransformWrapper>
   

      {/* <div className='px-4'>
        <img src={ImageView}/>
      </div> */}

    </ModalContent>
   
  )
}

export default ImageViewer
