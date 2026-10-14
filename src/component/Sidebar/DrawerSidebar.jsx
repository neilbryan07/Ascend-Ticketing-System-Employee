import React from 'react'

import Drawer from '@mui/material/Drawer';

import Sidebar from './Sidebar';

const DrawerSidebar = ({ openDrawer , toggleDrawer = null }) => {
  return (
    <Drawer open={openDrawer} onClose={ () => toggleDrawer(false) }>
        <Sidebar/>
    </Drawer>
  )
}

export default DrawerSidebar
