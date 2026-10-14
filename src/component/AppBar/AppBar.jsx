import React, { useEffect } from 'react'

import { IoMenuSharp } from 'react-icons/io5'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'

import LogoutIcon from '@mui/icons-material/Logout'

import { pageRoutes } from '../../contants'

import { Link, useNavigate } from 'react-router-dom'

import { getEmployeeProfile } from '../../redux/employee/employeeThunk'
import { useDispatch, useSelector } from 'react-redux'

const AppBar = ({ sidebar }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const emplopyeeResponses = useSelector(state => state.employee.action)
  const employee = emplopyeeResponses?.employeeResponse?.data?.payload
  

  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogOut = () => {
    localStorage.removeItem('access_token')
    navigate(pageRoutes.LOGIN)
  }

  useEffect(() => {
    if (localStorage.getItem('access_token') === null) {
      navigate('/login')
    }
  }, [])

  useEffect(() => {
    // debugger
    ;(async () => {
      await dispatch(getEmployeeProfile())
    })()
  }, [])

  return (
    <div className='w-full flex flex-row justify-between items-center bg-white rounded px-4 py-2'>
      <div className='flex flex-row gap-2'>
        <span
          className='text-2xl text-[#436850] cursor-pointer max-[1200px]:flex hidden'
          onClick={() => sidebar(true)}
        >
          <IoMenuSharp />
        </span>

        <div className='flex flex-row flex-wrap'>
          <span className='text-md font-kodeFont text-[#436850]'>Hello,</span>

          <span className='text-md font-semibold font-kodeFont text-[#12372A]'>
            {employee?.first_name} ( {employee?.project?.name} )
          </span>
        </div>
      </div>

      <div className='flex'>
        <Button
          id='basic-button'
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <Avatar sx={{ bgcolor: '#436850', width: 30, height: 30 }}>
            {employee?.first_name ? employee?.first_name?.charAt(0) : 'U'}
          </Avatar>
        </Button>

        <Menu
          id='basic-menu'
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button'
          }}
        >
          <MenuItem onClick={handleClose}>
            <div
              className='flex flex-row gap-3 items-center justify-center'
              onClick={() => handleLogOut()}
            >
              <span className='text-md text-[#436850]'>
                <LogoutIcon />
              </span>
              <span className='text-sm font-medium font-kodeFont'>Logout</span>
            </div>
          </MenuItem>
        </Menu>
      </div>
    </div>
  )
}

export default AppBar
