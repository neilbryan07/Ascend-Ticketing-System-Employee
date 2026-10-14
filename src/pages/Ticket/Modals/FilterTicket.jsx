import React from 'react'

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

import ModalContent from '../../../component/Modal/ModalContent';

import { IoSettingsOutline } from "react-icons/io5";
import { ColorlibStepIcon , TicketTopic as currencies } from '../../../contants'; 

const status = [ 'Pending' , 'Open' , 'Closed'] 


const FilterTicket = ({ 
    openModal ,  
    toggleModal , 
    filterStatus ,
    setFilterStatus ,
    filterTopic ,
    setFilterTopic ,
    handleUserTicket ,
}) => {
  return (
    <ModalContent icons={<IoSettingsOutline />} width='w-3/12'  open={openModal} handleClose={toggleModal} title={"Filter Ticket Table"}>
    <Box>

        <div className='w-full mt-8'>

            <TextField
                id="outlined-select-currency"
                select
                label="Status"
                helperText="Filter Data by Status"
                color="success"
                fullWidth
                value={filterStatus}
                onChange={ e =>  setFilterStatus( e.target.value ) }
            >
            {status.map((option) => (
                <MenuItem key={option} value={option}>
                    {option}
                </MenuItem>
            ))}
            </TextField>

        </div>

        <div className='w-full mt-3'>

            <TextField
                id="outlined-select-currency"
                select
                label="Topic"
                helperText="Filter Data by Topic"
                color="success"
                fullWidth
                value={filterTopic}
                onChange={ e =>  setFilterTopic( e.target.value ) }
            >
                {currencies.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                ))}
            </TextField>

        </div>
        
        <div className='w-full flex flex-row gap-2 justify-end items-center my-5'>
            <Button 
            variant="outlined" 
            color="success"
            onClick={ () => toggleModal(false)}
            >
            <span className='text-[#12372A] font-semibold font-kodeFont'>Cancel</span>
            </Button>

            <Button variant="contained" color="success" onClick={ () => [ handleUserTicket() , toggleModal(false)  ]  }>
            <div className='w-full flex flex-row gap-2 items-center'>
                <span className='text-white font-semibold font-kodeFont'>Filter</span>
                <span className='text-white font-semibold font-kodeFont'><IoSettingsOutline/></span>
            </div>
            </Button>

            { filterTopic || filterStatus ? 
        
                <Button variant="contained" color="error" onClick={ () => [ handleUserTicket(true) , toggleModal(false)  ]  }>
                <div className='w-full flex flex-row gap-2 items-center'>
                    <span className='text-white font-semibold font-kodeFont'>Remove Filter</span>
                    <span className='text-white font-semibold font-kodeFont'><IoSettingsOutline/></span>
                </div>
                </Button>
                : null
            }

        </div>

    </Box>
    </ModalContent>
  )
}

export default FilterTicket
