import React from 'react'
import Divider from '@mui/material/Divider'
import {
  IoTicketOutline,
  IoCalendarOutline,
  IoLibraryOutline,
  IoMedicalOutline,
  IoReaderOutline,
  IoTimeOutline,
  IoFolderOpenOutline,
  IoAlarmOutline 
} from 'react-icons/io5'

import SideBarLinks from '../Links/SideBarLinks'

import { pageRoutes } from '../../contants'

const Sidebar = () => {
  return (
    <div className='w-full flex flex-col px-4 gap-2 mb-5 h-full overflow-y-scroll'>
      <div className='w-full flex flex-col mt-2 mb-3'>
        <img
          className='w-[160px] h-[55px]'
          src={require('../../assets/images/NBPO_LOGO.png')}
          alt=''
        />
      </div>

      <Divider />

      <span className='text-xs font-bold font-kodeFont text-[#12372A] '>
        TICKETING
      </span>

      <SideBarLinks anchortags={pageRoutes.TICKET}>
        <span className='text-xl text-[#436850]'>
          <IoTicketOutline />
        </span>

        <span className='text-sm font-medium font-kodeFont'>IT Ticket</span>
      </SideBarLinks>

      <SideBarLinks anchortags={pageRoutes.HRTICKET}>
        <span className='text-xl text-[#436850]'>
          <IoTicketOutline />
        </span>

        <span className='text-sm font-medium font-kodeFont'>HR Ticket</span>
      </SideBarLinks>

      <SideBarLinks anchortags={pageRoutes.ACCTTICKET}>
        <span className='text-xl text-[#436850]'>
          <IoTicketOutline />
        </span>

        <span className='text-sm font-medium font-kodeFont'>ACCT Ticket</span>
      </SideBarLinks>

      <SideBarLinks anchortags={pageRoutes.UTILTICKET}>
        <span className='text-xl text-[#436850]'>
          <IoTicketOutline />
        </span>

        <span className='text-sm font-medium font-kodeFont'>
          Services Ticket
        </span>
      </SideBarLinks>

      <Divider />

      <span className='text-xs font-bold font-kodeFont text-[#12372A] mt-3'>
        TIMELOGS
      </span>

      <SideBarLinks anchortags={pageRoutes.LEAVEREQUEST}>
        <span className='text-xl text-[#436850]'>
          <IoCalendarOutline />
        </span>

        <span className='text-md font-kodeFont w-full flex flex-row justify-between items-center'>
          <span className='text-sm font-medium'>Leave Request</span>
        </span>
      </SideBarLinks>

      <SideBarLinks anchortags={pageRoutes.OVERTIME}>
        <span className='text-xl text-[#436850]'>
          <IoAlarmOutline />
        </span>

        <span className='text-md font-kodeFont w-full flex flex-row justify-between items-center'>
          <span className='text-sm font-medium'>File Over Time</span>
        </span>
      </SideBarLinks>

      <SideBarLinks anchortags={pageRoutes.TIMESHEETS}>
        <span className='text-xl text-[#436850]'>
          <IoTimeOutline />
        </span>

        <span className='text-sm font-medium font-kodeFont'>
          <span className='text-sm font-medium'>Timesheet</span>
        </span>
      </SideBarLinks>

      <Divider />

      <span className='text-xs font-bold font-kodeFont text-[#12372A] mt-3'>
        COMPANY POLICY
      </span>

      <SideBarLinks>
        <span className='text-xl text-[#436850]'>
          <IoMedicalOutline />
        </span>

        <span className='text-md font-kodeFont w-full flex flex-row justify-between items-center'>
          <span className='text-sm font-medium'>Medical Assistance</span>
          <div className='text-[10px] rounded-full bg-[#ADBC9F] text-white py-[2px] px-[2px] flex flex-cols items-center justify-center'>
            N/A
          </div>
        </span>
      </SideBarLinks>

      <SideBarLinks>
        <span className='text-xl text-[#436850]'>
          <IoReaderOutline />
        </span>

        <span className='text-md font-kodeFont w-full flex flex-row justify-between items-center'>
          <span className='text-sm font-medium'>Guidelines</span>
          <div className='text-[10px] rounded-full bg-[#ADBC9F] text-white py-[2px] px-[2px] flex flex-cols items-center justify-center'>
            N/A
          </div>
        </span>
      </SideBarLinks>

      <SideBarLinks>
        <span className='text-xl text-[#436850]'>
          <IoLibraryOutline />
        </span>

        <span className='text-md font-kodeFont w-full flex flex-row justify-between items-center'>
          <span className='text-sm font-medium'>Handbook</span>
          <div className='text-[10px] rounded-full bg-[#ADBC9F] text-white py-[2px] px-[2px] flex flex-cols items-center justify-center'>
            N/A
          </div>
        </span>
      </SideBarLinks>

      <Divider />

      <span className='text-xs font-bold font-kodeFont text-[#12372A] mt-3'>
        EMPLOYEE REQUEST
      </span>

      <SideBarLinks>
        <span className='text-xl text-[#436850]'>
          <IoFolderOpenOutline />
        </span>

        <span className='text-md font-kodeFont  w-full flex flex-row justify-between items-center'>
          <span className='text-sm font-medium'>Request COE</span>
          <div className='text-[10px] rounded-full bg-[#ADBC9F] text-white py-[2px] px-[2px] flex flex-cols items-center justify-center'>
            N/A
          </div>
        </span>
      </SideBarLinks>
    </div>
  )
}

export default Sidebar
