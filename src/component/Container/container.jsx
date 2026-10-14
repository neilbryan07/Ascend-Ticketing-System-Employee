import React , { useState } from 'react'

import { Outlet } from 'react-router-dom';

import Sidebar from '../Sidebar/Sidebar';

import AppBar from '../AppBar/AppBar';
import DrawerSidebar from '../Sidebar/DrawerSidebar';

const Container = () => {

  const [ sidebarActive , setSideBarActive ] = useState(false);

  return (
    <div className='flex flex-row bg-gray-100 w-full h-screen overflow-x-hidden'>
        
        <div className='max-w-[280px] w-full flex flex-col border-r border-gray-200 bg-white max-[1200px]:hidden'>
          <Sidebar/>
        </div>

        <DrawerSidebar openDrawer={sidebarActive} toggleDrawer={setSideBarActive} />

        <div className='flex flex-auto flex-col overflow-x-hidden'>
 
          <div className='flex flex-col overflow-x-hidden p-4 gap-2'>
            <AppBar sidebar={setSideBarActive}/>
            <Outlet />
          </div>

        </div>

    </div>
  )
}

export default Container
