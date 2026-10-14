import React , { useState , useEffect } from 'react'

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

import ModalContent from '../../../component/Modal/ModalContent';

import { IoSettingsOutline } from "react-icons/io5";
import { ColorlibStepIcon , TicketTopic as currencies } from '../../../contants'; 

import { APIServices } from '../../../hooks/fetchAPI';


const status = [ 
    { id : 1 , label : 'Open'},
    { id : 2 , label : 'Pending'},
    { id : 3 , label : 'Closed'},
] 


const FilterOverTime = ({ 
    openModal ,  
    toggleModal , 
    overTimeTypeData , 
    overTimeStatusData,
    filterTypeOT ,
    setFilterTypeOT ,
    filterStatusOT ,
    setFilterStatusOT ,
    handleOverTimeData ,

}) => {

  return (
    <ModalContent icons={<IoSettingsOutline />} width='w-3/12'  open={openModal} handleClose={toggleModal} title={"Filter Over Time Table"}>
    <Box>

        <div className='w-full mt-8'>

            <TextField
                id="outlined-select-currency"
                select
                label="Status"
                helperText="Filter Data by Status"
                color="success"
                fullWidth
                value={ filterStatusOT }
                onChange={ e =>  setFilterStatusOT( e.target.value ) }
            >
            { overTimeStatusData?.map((option) => (
                <MenuItem key={ option?.value } value={ option?.value }>
                    { option?.label }
                </MenuItem>
            ))}
            </TextField>

        </div>

        <div className='w-full mt-3'>

            <TextField
                id="outlined-select-currency"
                select
                label="Over time Type"
                helperText="Filter Data by Over time"
                color="success"
                fullWidth
                value={ filterTypeOT }
                onChange={ e =>  setFilterTypeOT( e.target.value ) }
            >
                { overTimeTypeData?.map(( option ) => (
                    <MenuItem key={ option?.value } value={ option?.value }>
                        { option?.label }
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

            <Button variant="contained" color="success" onClick={ () => [ handleOverTimeData() , toggleModal(false)  ]  }>
            <div className='w-full flex flex-row gap-2 items-center'>
                <span className='text-white font-semibold font-kodeFont'>Filter</span>
                <span className='text-white font-semibold font-kodeFont'><IoSettingsOutline/></span>
            </div>
            </Button>

            { filterTypeOT || filterStatusOT ? 
        
                <Button variant="contained" color="error" onClick={ () => [ handleOverTimeData(true) , toggleModal(false) , setFilterStatusOT( null ) ,  setFilterTypeOT(null) ]  }>
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

export default FilterOverTime
