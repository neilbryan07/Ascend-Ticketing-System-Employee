import React , { useRef, useEffect, useState } from 'react'

import Button from '@mui/material/Button';

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

import { IoSendOutline , IoTicketOutline } from "react-icons/io5";

import { ColorlibStepIcon , TicketTopic as TicketTopicSelection } from '../../../contants'; 
import Checkbox from '@mui/material/Checkbox';

import { Alert } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

import ModalContent from '../../../component/Modal/ModalContent';

import { APIServices } from '../../../hooks/fetchAPI';

const CreateAscendTicket = ({ 
        openModal , 
        toggleModal , 
        activeSteps ,
        ticketTopics ,
        ticketSubTopics , 
        ticketDescription , 
        subTickets ,
        handleTicketTopics ,
        handleTicketSubTopics , 
        setTicketDescriptionTopics , 
        setHandleOpens , 
        handleTicketSubmit,
        setIsUrgent , 
        successTrigger , 
        errorTrigger , 
        alertMessage , 
        isLoading,
        department_id
    }) => {


    const [ handleTicketData , setHandleTicketData ] = useState(false);
    const [ handleSubTicketData , setHandleSubTicketData ] = useState(false);
      
    const handleTicket = async () => {

        const res = await APIServices.post({ url: '/ticket-topic/get-ticket-topic' , payload : { "department_id" : department_id } })
        setHandleTicketData( res?.data )
    }

    const onChangeTicketTopics = async (event) => {

        const res = await APIServices.post({ url: '/ticket-sub-topic/get-ticket-sub-topic-one' , payload : { "ticket_topic_id" : event.target.value } })

        setHandleSubTicketData( res?.data )
    }
    
    useEffect( ()  => {
        handleTicket();
    }, []);


  return (
    <ModalContent icons={<IoTicketOutline/>} open={openModal} handleClose={toggleModal} title={"Create New Ticket"}>
    <Box>

      <Stepper activeStep={activeSteps} orientation="vertical">

        
          <Step expanded={ ticketTopics ? true : false}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>
              <span className='text-black font-semibold font-kodeFont'>Select a Ticket Topic</span>
            </StepLabel>
            <StepContent sx={{  width : '100%'}}>

              <div className='w-full flex flex-col items-start justify-start mt-7'>

                <div className='w-full'>

                  <TextField
                    id="outlined-select-currency"
                    select
                    label="Topic"
                    helperText="Please select ticket topic"
                    color="success"
                    fullWidth
                    value={ticketTopics}
                    onChange={ e => [handleTicketTopics(e) , onChangeTicketTopics(e) ] }
                  >
                    { handleTicketData?.ticket_topics?.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>

                </div>

                <div className='w-fulll flex flex-row items-center'>
                      <Checkbox color='success' onChange={ e => setIsUrgent( e.target.checked ) }/>
                      <span className='text-black font-semibold font-kodeFont'>is urgent ?</span>
                </div>

              </div>
 
            </StepContent>
          </Step>

          <Step expanded={ ticketSubTopics ? true : false}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>
              <span className='text-black font-semibold font-kodeFont'>Select Ticket Sub Category</span>
            </StepLabel>


            <StepContent>

              <div className='w-full flex flex-col items-start justify-start '>

                {/* <span className='text-green-800 font-semibold text-sm font-kodeFont my-3'>{ handleTicketData?.Topic_Description?.[ticketTopics]?.name }</span> */}

                <div className='w-full'>

                  <TextField
                    id="outlined-select-currency"
                    select
                    label="SubTopic"
                    helperText={ticketSubTopics?.[0]?.description}
                    color="success"
                    fullWidth
                    value={ticketSubTopics}
                    onChange={ handleTicketSubTopics }
                  >
                  
                    { handleSubTicketData?.ticket_sub_topics?.map((option , key) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>

                </div>

              </div>

            </StepContent>
          </Step>

          <Step expanded={ ticketDescription ? true : false}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>
              <span className='text-black font-semibold font-kodeFont'>Add Ticket Description</span>
            </StepLabel>
            <StepContent>

              <div className='w-full flex flex-col items-start justify-start mt-3'>

                <div className='w-full'>

                <TextField
                  id="outlined-multiline-flexible"
                  label="Ticket Description"
                  multiline
                  maxRows={10}
                  value={ticketDescription}
                  onChange={ e =>  setTicketDescriptionTopics(e.target.value) }
                  variant="outlined"
                  fullWidth
                />

                </div>

              </div>

            </StepContent>
          </Step>

      </Stepper>
                      <br/>
      { errorTrigger ? 
          <Alert severity="error">Error Adding New Ticket. Please Contact IT Department</Alert>
      : null  }

      { successTrigger ? 
          <Alert severity="success">{alertMessage}</Alert>
      : null  }

      { ticketDescription ?  

      <div className='w-full flex flex-row gap-2 justify-end items-center my-5'>

        <Button 
          variant="outlined" 
          color="success"
          onClick={ () => setHandleOpens(false)}
        >
          <span className='text-[#12372A] font-semibold font-kodeFont'>Cancel</span>
        </Button>

        <Button variant="contained" color="success" onClick={ () => handleTicketSubmit() }>
          <div className='w-full flex flex-row gap-2 items-center'>
            <span className='text-white font-semibold font-kodeFont'>Submit</span>
            <span className='text-white font-semibold font-kodeFont'> { isLoading ? <CircularProgress size={20} color={'inherit'}/> : <IoSendOutline/> } </span>
          </div>
        </Button>
      </div>

      : null}

    </Box>
    </ModalContent>
  )
}

export default CreateAscendTicket
