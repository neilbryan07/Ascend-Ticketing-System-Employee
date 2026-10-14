import React, { useRef, useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'

import ModalContent from '../../../component/Modal/ModalContent'

import { IoSettingsOutline } from 'react-icons/io5'
import { ColorlibStepIcon, LeaveType as currencies } from '../../../contants'
import { APIServices } from '../../../hooks/fetchAPI'
import { useSelector } from 'react-redux'

const status = ['Pending', 'Approved', 'Rejected']

const FilterRequest = ({
  openModal,
  toggleModal,
  filterStatus,
  setFilterStatus,
  filterTopic,
  setFilterTopic,
  handleUserTicket,
  handleType
}) => {
  const emplopyeeResponses = useSelector(state => state.employee.action)
  const employee = emplopyeeResponses?.employeeResponse?.data?.payload

  const [handleStatus, setHandleStatus] = useState(false)

  const handleStatusData = async () => {
    const res = await APIServices.get({
      url: '/leave-admin-module/view-status'
    })
    setHandleStatus(res?.data)
  }

  useEffect(() => {
    handleStatusData()
  }, [])

  console.log(handleType)

  return (
    <ModalContent
      icons={<IoSettingsOutline />}
      width='w-3/12'
      open={openModal}
      handleClose={toggleModal}
      title={'Filter Request Table'}
    >
      <Box>
        <div className='w-full mt-8'>
          <TextField
            id='outlined-select-currency'
            select
            label='Status'
            helperText='Filter Data by Status'
            color='success'
            fullWidth
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            {handleStatus?.data?.map(option => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </div>

        <div className='w-full mt-3'>
          <TextField
            id='outlined-select-currency'
            select
            label='Topic'
            helperText='Filter Data by Topic'
            color='success'
            fullWidth
            value={filterTopic}
            onChange={e => setFilterTopic(e.target.value)}
          >
            {handleType?.data?.map(option => (
              <MenuItem
                key={option?.leave_type_id}
                value={option?.leave_type_id}
              >
                {option?.leave_type_name}
              </MenuItem>
            ))}
          </TextField>
        </div>

        <div className='w-full flex flex-row gap-2 justify-end items-center my-5'>
          <Button
            variant='outlined'
            color='success'
            onClick={() => toggleModal(false)}
          >
            <span className='text-[#12372A] font-semibold font-kodeFont'>
              Cancel
            </span>
          </Button>

          <Button
            variant='contained'
            color='success'
            onClick={() => [handleUserTicket(), toggleModal(false)]}
          >
            <div className='w-full flex flex-row gap-2 items-center'>
              <span className='text-white font-semibold font-kodeFont'>
                Filter
              </span>
              <span className='text-white font-semibold font-kodeFont'>
                <IoSettingsOutline />
              </span>
            </div>
          </Button>

          {filterTopic || filterStatus ? (
            <Button
              variant='contained'
              color='error'
              onClick={() => [handleUserTicket(true), toggleModal(false)]}
            >
              <div className='w-full flex flex-row gap-2 items-center'>
                <span className='text-white font-semibold font-kodeFont'>
                  Clear
                </span>
                <span className='text-white font-semibold font-kodeFont'>
                  <IoSettingsOutline />
                </span>
              </div>
            </Button>
          ) : null}
        </div>
      </Box>
    </ModalContent>
  )
}

export default FilterRequest
