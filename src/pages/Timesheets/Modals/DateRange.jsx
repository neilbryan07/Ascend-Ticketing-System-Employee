import React , { useState } from 'react'

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

import { DateRangePicker , DateRange } from 'react-date-range';

import { addDays } from 'date-fns';

import ModalContent from '../../../component/Modal/ModalContent';

import { IoSendOutline , IoTicketOutline , IoSettingsOutline } from "react-icons/io5";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const DateRangeUI = ({
    openModal , 
    toggleModal , 
    handleUserTicket
}) => {

    const [ rangeDate , setRangeDate ] = useState([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: 'selection'
        }
    ]);

    const handleSelect = (ranges) =>{
        setRangeDate(ranges)
    }

    const handleFilter = () => {
        handleUserTicket( rangeDate?.[0]?.startDate , rangeDate?.[0]?.endDate)
        toggleModal(false);
    }

  return (
    <ModalContent icons={<IoTicketOutline/>} open={openModal} handleClose={toggleModal} title={"Filter Date Range"} isWhite={false}>

        <div className='w-full flex flex-col my-2 items-center justify-center'>

            <DateRange
                editableDateInputs={true}
                onChange={item => handleSelect([item.selection]) }
                moveRangeOnFirstSelection={false}
                ranges={rangeDate}
                // rangeColors={'#2e7d32'}
                color="#2e7d32"
                rangeColors="#2e7d32"
            />

            {/* <DateRangePicker
                onChange={item => handleSelect([item.selection]) }
                showSelectionPreview={true}
                moveRangeOnFirstSelection={false}
                months={1}
                ranges={rangeDate}
                direction="horizontal"
            /> */}

        </div>

        <div className='w-full flex flex-row justify-end items-center gap-3 mt-5 mb-2'>

            <Button 
                variant="outlined" 
                color="success"
                onClick={ () => toggleModal(false)}
            >
                <span className='text-[#12372A] font-semibold font-kodeFont'>Cancel</span>
            </Button>

            <Button variant="contained" color="success" onClick={ () => handleFilter() }>
                <div className='w-full flex flex-row gap-2 items-center'>
                    <span className='text-white font-semibold font-kodeFont'>Filter</span>
                    <span className='text-white font-semibold font-kodeFont'><IoSettingsOutline/></span>
                </div>
            </Button>

        </div>
      
    </ModalContent>
  )
}

export default DateRangeUI
