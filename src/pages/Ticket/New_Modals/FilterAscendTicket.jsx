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


const FilterAscendTicket = ({ 
    openModal ,  
    toggleModal , 
    filterStatus ,
    setFilterStatus ,
    filterTopic ,
    setFilterTopic ,
    handleUserTicket ,
    department_id,
}) => {

    const [ handleTicketData , setHandleTicketData ] = useState(false);

    useEffect( ()  => {
        handleTicket();
    }, []);

    const handleTicket = async () => {

        const res = await APIServices.post({ url: '/ticket-topic/get-ticket-topic' , payload : { "department_id" : department_id } })
        setHandleTicketData( res?.data )
    }

  return (
    <ModalContent icons={<IoSettingsOutline />} width='w-3/12'  open={openModal} handleClose={toggleModal} title={"Filter Ticket Grip Table"}>
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
                <MenuItem key={option?.id} value={option?.id}>
                    {option?.label}
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
                {handleTicketData?.ticket_topics?.map((option) => (
                    <MenuItem key={option?.id} value={option?.id}>
                        {option?.name}
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

export default FilterAscendTicket
