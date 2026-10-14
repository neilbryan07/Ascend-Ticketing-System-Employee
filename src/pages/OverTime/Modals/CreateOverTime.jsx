import React , { useRef, useEffect, useState } from 'react'

import Button from '@mui/material/Button';

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

import Divider from '@mui/material/Divider';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import Chip from '@mui/material/Chip'

import { IoSendOutline , IoTicketOutline } from "react-icons/io5";

import { ColorlibStepIcon , TicketTopic as TicketTopicSelection , formatDate , combineDateTime , handleDateOnlyFormat } from '../../../contants'; 
import Checkbox from '@mui/material/Checkbox';

import { Alert } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

import ModalContent from '../../../component/Modal/ModalContent';

import { APIServices } from '../../../hooks/fetchAPI';


const CreateOverTime = ({ 
        openModal , 
        toggleModal , 
        overTimeTypeData,
        handleOverTimeData ,
    }) => {

    const [ activeSteps , setActiveSteps ] = useState(0);

    // Employement
    const [ selectedTimeInEmp, setSelectedTimeInEmp ] = useState( null );
    const [ selectedTimeOutEmp, setSelectedTimeOutEmp ] = useState( null );

    // Overtime
    const [ overTimeType , setOverTimeType ] = useState( '' );
    const [ overTimeRemarks , setOverTimeRemarks ] = useState( null );
    const [ selectedTimeInOTEmp , setSelectedTimeInOTEmp ] = useState( null );
    const [ selectedTimeOutOTEmp , setSelectedTimeOutOTEmp ] = useState( null );
    const [ selectedDateInOTEmp , setSelectedDateInOTEmp ] = useState( null );
    const [ selectedDateOutOTEmp , setSelectedDateOutOTEmp ] = useState( null );
    

    const [ isLoading , setIsLoading ] = useState( false )
    const [ success , setSuccess ] = useState( false )
    const [ errors , setError ] = useState( false )
    const [ errorOT , setErrorOT ] = useState( false )
    const [ errorOTMessagee , setErrorOTMessage ] = useState( null )
    const [ message , setMessage ] = useState( null )


    const handleTimeOnly = (newDate) => {

      if ( newDate == null ) {
        return "N/A";
      }

      let dateFormat =  new Date(newDate);

      let hours = dateFormat.getHours();
      const minutes = dateFormat.getMinutes();

      // Convert hours to 12-hour format
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'

      // Format minutes to be always two digits
      const minutesStr = minutes < 10 ? '0' + minutes : minutes;

      // Combine hours, minutes, and AM/PM
      const formattedTime = `${hours}:${minutesStr} ${ampm}`;

      return formattedTime

    }

    const handleTotalTime = ( from , to ) => {

      const startDate = new Date(from);
      const endDate = new Date(to);

      const differenceInMs = endDate - startDate;

      const totalMinutes = Math.floor(differenceInMs / (1000 * 60));

      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      const formattedResult = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      return formattedResult;

    }

    
    const handleEmployeeTotalTime = ( from , to ) => {

      const startDate = new Date(from);
      const endDate = new Date(to);

      const differenceInMs = endDate - startDate;

      // const totalMinutes = Math.floor(differenceInMs / (1000 * 60));

      const diffInHours = differenceInMs / (1000 * 60 * 60);

      return parseInt(diffInHours);

    }

    const handleOverTimeCalculation = () => {

      let combineOTSched = calculateTotalHours( combineDateTime( selectedDateInOTEmp , selectedTimeInOTEmp ) , combineDateTime( selectedDateOutOTEmp , selectedTimeOutOTEmp ) );

      if ( parseInt ( overTimeType ) === 1 ) {

          let combineRdotSched =  calculateTotalHours( combineDateTime( selectedDateInOTEmp , selectedTimeInOTEmp ) , combineDateTime( selectedDateOutOTEmp , selectedTimeOutOTEmp ) );
   
          if ( combineRdotSched < 30 ) {
              setErrorOT(true);
              setErrorOTMessage('The time difference must be at least 30 minutes.');
              return;
          }

          if ( combineRdotSched > 540 ) {
              setErrorOT(true);
              setErrorOTMessage('The time difference cannot exceed 9 hours.');
              return;
          }

          setActiveSteps(2);
          setErrorOT( false);
          return;

      }

      if ( parseInt ( overTimeType ) === 4 || parseInt ( overTimeType ) === 2  || parseInt ( overTimeType ) === 3 ) {

          let timeIn = new Date ( combineDateTime( selectedDateInOTEmp , selectedTimeOutEmp ) );
          let OTtimeIn = new Date ( combineDateTime( selectedDateInOTEmp , selectedTimeInOTEmp ) );

          if ( OTtimeIn >= timeIn ) {

            
            if ( combineOTSched < 30 ) {
                setErrorOT(true);
                setErrorOTMessage('The time difference must be at least 30 minutes.');
                return;
            }

            if ( combineOTSched > 480 ) {
                setErrorOT(true);
                setErrorOTMessage('The time difference cannot exceed 8 hours.');
                return;
            }

            setActiveSteps(2);
            setErrorOT( false);
            return;

          }

          setErrorOT(true);
          setErrorOTMessage( "Overtime Time In is less than the Employee Time Out " ) ;
          return;

      }

    }

    const calculateTotalHours = ( startDate , endDate ) => {
      const start = new Date(startDate);
      const end = new Date(endDate);
  
      const diffInMs = end - start; // difference in milliseconds
      const diffInMinutes = diffInMs / (1000 * 60); // convert to minutes

      return diffInMinutes ;
  
    };

    const findId = (id) => {
      let data = overTimeTypeData?.find(item => item.value === id);

      return data?.label;
    };

    const handleOverTimeSubmit = async () => {

      setSuccess(false);
      setError(false);
      setIsLoading(true)

      const data = {
        "department_id" : 11,
        "ot_status" : 1,
        "overtime_type" : overTimeType,
        "ot_time_in" : combineDateTime( selectedDateInOTEmp , selectedTimeInOTEmp ),
        "ot_time_out" : combineDateTime( selectedDateOutOTEmp , selectedTimeOutOTEmp ),
        "total_time" : handleTotalTime( combineDateTime( selectedDateInOTEmp , selectedTimeInOTEmp ) , combineDateTime( selectedDateOutOTEmp , selectedTimeOutOTEmp ) ),
        "ot_date" : formatDate( new Date() ),
        "employee_time_in_schedule" : handleTimeOnly( selectedTimeInEmp ),
        "employee_time_out_schedule" : handleTimeOnly( selectedTimeOutEmp ),
        "description" : overTimeRemarks
      } 

      const res = await APIServices.post({ url: 'employee-module/create-over-time', payload: data })
  
      if ( !res.error ) {

          setSuccess(false);
          setError(false);

          if ( !res?.data?.error ) {
              
              setSuccess(true);
              setTimeout(() => {
              
                handleOverTimeData()
                setIsLoading(false)
                toggleModal(false)
              
              }, 1500)

          }
          setIsLoading(false)
          setError( res?.data?.error );
          setMessage( res?.data?.message )
        
      } else {
          setIsLoading(false)
          setSuccess(false);
          setError(false)
      }

    }
   
  return (
    <ModalContent icons={<IoTicketOutline/>} open={openModal} handleClose={toggleModal} title={"File Overtime"} >
    <Box>

      <Stepper activeStep={activeSteps} orientation="vertical">

        
          <Step expanded={  activeSteps == 0 ? true : false }>
            <StepLabel StepIconComponent={ColorlibStepIcon}>
              <span className='text-black font-semibold font-kodeFont'>Employment Scheduled Time</span>
            </StepLabel>
            <StepContent sx={{  width : '100%'}}>

              <div className='w-full flex flex-col items-start justify-start mt-7'>

                    <div className='w-full'>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            
                            <DemoContainer components={[
                                'TimePicker',
                                'MobileTimePicker',
                                'DesktopTimePicker',
                                'StaticTimePicker',
                            ]}>
                  
                              <MobileTimePicker label="Time Time-In" className="w-full"  value={ selectedTimeInEmp } onChange={ setSelectedTimeInEmp }    />
             
                            </DemoContainer>
                        </LocalizationProvider>

                    </div>

                    <br/>

                    <div className='w-full'>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            
                            <DemoContainer components={[
                                'TimePicker',
                                'MobileTimePicker',
                                'DesktopTimePicker',
                                'StaticTimePicker',
                            ]}>
                                <MobileTimePicker label="Time Time-Out" className="w-full" value={ selectedTimeOutEmp } onChange={ setSelectedTimeOutEmp }    />
                            </DemoContainer>
                        </LocalizationProvider>

                    </div>

                    <br/>
                  
                  { selectedTimeInEmp && selectedTimeOutEmp && handleEmployeeTotalTime( selectedTimeInEmp , selectedTimeOutEmp ) === 9 ?
                   
                    <Button variant="contained" color="success" onClick={ () => setActiveSteps(1) }>
                        <div className='w-full flex flex-row gap-2 items-center'>
                            <span className='text-white font-semibold font-kodeFont'>Proceed</span>
                        </div>
                    </Button>

                    :

                    <span className='text-gray-500 text-xs'>Employment schedule should be 9hrs <span className='text-red-500 text-xs'>*</span></span>

                  }

              </div>
 
            </StepContent>
          </Step>

          <Step expanded={  activeSteps == 1 ? true : false }>
            <StepLabel StepIconComponent={ColorlibStepIcon}>
              <span className='text-black font-semibold font-kodeFont'>Overtime rendered hours</span>
            </StepLabel>


            <StepContent>

              <div className='w-full flex flex-col'>

                <div className='w-full'>

                    <TextField
                        id="outlined-select-currency"
                        select
                        label="OverTime Type"
                        helperText="Please select type"
                        color="success"
                        fullWidth
                        value={ overTimeType }
                        onChange={ e => [ setOverTimeType(e.target.value) ] }
                    >
                    { overTimeTypeData?.map((option) => (
                        <MenuItem key={option?.value} value={option?.value}>
                          {option.label}
                        </MenuItem>
                    ))}
                    </TextField>

                </div>

                <br/>

                
                <div className='w-full'>

                  <TextField
                      id="outlined-multiline-flexible"
                      label="Please add the reason for this entry.."
                      multiline
                      maxRows={10}
                      variant="outlined"
                      fullWidth
                      value={ overTimeRemarks }
                      onChange={e => setOverTimeRemarks(e.target.value)}
                  />

                </div>
                
                <br/>

                <div className='w-full'>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        
                        <DemoContainer components={[
                            'TimePicker',
                            'MobileTimePicker',
                            'DesktopTimePicker',
                            'StaticTimePicker',
                        ]}>
                            <DatePicker label="Date Time-In(OT)" value={ selectedDateInOTEmp } onChange={ setSelectedDateInOTEmp } />
                            <MobileTimePicker label="Time Time-In(OT)" value={ selectedTimeInOTEmp } onChange={ setSelectedTimeInOTEmp } />
                        </DemoContainer>
                    </LocalizationProvider>

                </div>

                <br/>
                
                <div className='w-full'>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        
                        <DemoContainer components={[
                            'TimePicker',
                            'MobileTimePicker',
                            'DesktopTimePicker',
                            'StaticTimePicker',
                        ]}>
                             <DatePicker label="Date Time-Out(OT)" value={ selectedDateOutOTEmp } onChange={ setSelectedDateOutOTEmp } />
                            <MobileTimePicker label="Time Time-Out(OT)" value={ selectedTimeOutOTEmp } onChange={ setSelectedTimeOutOTEmp } />
                        </DemoContainer>
                    </LocalizationProvider>

                </div>
                
                { overTimeType && overTimeRemarks &&  
                  selectedTimeInOTEmp &&  selectedTimeOutOTEmp && 
                  selectedDateInOTEmp && selectedDateOutOTEmp &&

                  <div className='w-full flex flex-row gap-2 justify-start items-center my-5'>

                    <Button variant="contained" color="success" 
                                          onClick={ () => handleOverTimeCalculation() }
                    // onClick={ () => setActiveSteps(2) }
                    >
                        <div className='w-full flex flex-row gap-2 items-center'>
                            <span className='text-white font-semibold font-kodeFont'>Proceed</span>
                        </div>
                    </Button>

                    <Button 
                      variant="text"
                      color="success"
                      onClick={ () => setActiveSteps(0) }
                    >
                      <span className='text-[#12372A] font-semibold font-kodeFont'>Go Back</span>
                    </Button>
        
                  </div>

                }

                { errorOT ? 
                    <Alert severity="error">{ errorOTMessagee }</Alert>
                : null  }
     
              </div>

            </StepContent>
          </Step>

          
          <Step expanded={  activeSteps == 2 ? true : false }>
            <StepLabel StepIconComponent={ColorlibStepIcon}>
              <span className='text-black font-semibold font-kodeFont'>Over Time Summary</span>
            </StepLabel>

            <StepContent>

              <div className='w-full flex flex-col gap-2'>

                <div className='w-full flex flex-col gap-4 py-4 px-2'>

                  <div className='w-full flex flex-row items-center justify-between flex-wrap'>

                    <div className='flex flex-col gap-2 items-start'>

                      <span className='text-green-700 text-sm font-kodeFont'>Normal Shift</span>

                      <span className='text-black text-sm font-medium font-kodeFont'>{ `${handleTimeOnly( selectedTimeInEmp )} - ${handleTimeOnly( selectedTimeOutEmp )}` }</span>

                    </div>

                    <div className='flex flex-col gap-2  items-start'>

                      <span className='text-green-700 text-sm font-kodeFont'>Type</span>

                      <span className='text-black text-sm font-medium  font-kodeFont'>{ findId(overTimeType) } </span>

                    </div>

                  </div>

                  <div className='w-full flex flex-row items-center justify-between flex-wrap'>
     
                    <div className='flex flex-col gap-2 items-start'>

                      <span className='text-green-700 text-sm font-kodeFont'>Over Date / Time In</span>

                      <Chip label={ ` ${ handleDateOnlyFormat(selectedTimeInOTEmp) } - ${handleTimeOnly( selectedTimeInOTEmp )} ` }  color="success" variant="outlined" /> 

                    </div>
           
                    <div className='flex flex-col gap-2 items-start'>

                      <span className='text-green-700 text-sm font-kodeFont'>Over Date / Time Out</span>

                      <Chip label={ ` ${ handleDateOnlyFormat(selectedTimeOutOTEmp) } - ${handleTimeOnly( selectedTimeOutOTEmp )} ` }  color="success" variant="outlined" /> 

                    </div>        

                    <div className='flex flex-col gap-2 items-center'>

                      <span className='text-green-700 text-sm font-kodeFont'>Total OT</span>

                      <Chip label={ handleTotalTime( combineDateTime( selectedDateInOTEmp , selectedTimeInOTEmp ) , combineDateTime( selectedDateOutOTEmp , selectedTimeOutOTEmp ) ) }  color="success" variant="contained" /> 

                    </div>

                  </div>

                  
                  <div className='flex flex-col gap-2  items-start'>

                    <span className='text-green-700 text-sm font-kodeFont'>Remarks</span>

                    <span className='text-black font-medium text-sm font-kodeFont'>{overTimeRemarks}</span>

                  </div>

                </div>
              
              </div>

            </StepContent>

          </Step>


      </Stepper>

      <br/>

      { errors ? 
          <Alert severity="error">{ message }</Alert>
      : null  }

      { success ? 
          <Alert severity="success">Successfully Added Overtime</Alert>
      : null  }

      { activeSteps === 2 &&

        <div className='w-full flex flex-row gap-2 justify-between items-center my-5'>

          <Button 
            variant="outlined" 
            color="success"
            onClick={ () => setActiveSteps(1) }
          >
            <span className='text-[#12372A] font-semibold font-kodeFont'>Go Back</span>
          </Button>

          <Button variant="contained" color="success" onClick={ () => handleOverTimeSubmit() }>
              <div className='w-full flex flex-row gap-2 items-center'>
                  <span className='text-white font-semibold font-kodeFont'>Submit</span>
                  <span className='text-white font-semibold font-kodeFont'> { isLoading ? <CircularProgress size={20} color={'inherit'}/> : <IoSendOutline/> } </span>
              </div>
          </Button>
        </div>

      }


    </Box>
    </ModalContent>
  )
}

export default CreateOverTime
