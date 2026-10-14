import React , { useRef, useEffect, useState } from 'react'

import Button from '@mui/material/Button';
import SettingsIcon from '@mui/icons-material/Settings';

import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Chip from '@mui/material/Chip';

import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';

import ModalContent from '../../component/Modal/ModalContent';

import { IoImageOutline } from "react-icons/io5";

import { TablePaginationActions } from '../../component/Table/TablePagination'; 

import { APIServices } from '../../hooks/fetchAPI';

import { DefaultAPIRoute } from '../../contants';

import { Alert } from '@mui/material';

import DateRangeUI from './Modals/DateRange';

const rows = [
    createData('February 01, 2024', '8:47 AM' , '6:17 AM' , '09:30' ),
    createData('February 02, 2024', '8:37 AM' , '3:17 AM' , '09:30' ),
    createData('February 03, 2024', '8:27 AM' , '5:17 AM' , '09:30' ),
    createData('February 04, 2024', '8:27 AM' , '9:17 AM' , '09:30' ),
    createData('February 05, 2024', '8:17 AM' , '8:17 AM' , '09:30' ),
    createData('February 06, 2024', '8:47 AM' , '6:17 AM' , '09:30' ),
    createData('February 07 2024', '8:37 AM' , '3:17 AM' , '09:30' ),
    createData('February 08, 2024', '8:27 AM' , '5:17 AM' , '09:30' ),
    createData('February 09, 2024', '8:27 AM' , '9:17 AM' , '09:30' ),
    createData('February 10, 2024', '8:17 AM' , '8:17 AM' , '09:30' ),
    createData('February 11, 2024', '8:47 AM' , '6:17 AM' , '09:30' ),
    createData('February 12, 2024', '8:37 AM' , '3:17 AM' , '09:30' ),
    createData('February 13, 2024', '8:27 AM' , '5:17 AM' , '09:30' ),
    createData('February 14, 2024', '8:27 AM' , '9:17 AM' , '09:30' ),
    createData('February 15, 2024', '8:17 AM' , '8:17 AM' , '09:30' ),
    createData('February 16, 2024', '8:47 AM' , '6:17 AM' , '09:30' ),
    createData('February 17 2024', '8:37 AM' , '3:17 AM' , '09:30' ),
    createData('February 18, 2024', '8:27 AM' , '5:17 AM' , '09:30' ),
    createData('February 19, 2024', '8:27 AM' , '9:17 AM' , '09:30' ),
    createData('February 20, 2024', '8:17 AM' , '8:17 AM' , '09:30' ),
  ];

function createData(date_logs , time_in , time_out , total_hours) {
    return { date_logs , time_in , time_out , total_hours };
  }
  
  function Row(props) {
    const { row , sized } = props;
    const [open, setOpen] = React.useState(false);

    const [ openModal , setOpenModal ] = useState(false);

    const [ screenShot , setScreenShot ] = useState(null);
    const [ imageSelected , setImageSelected ] = useState(null);

    const handleDateFormat = (value) => {

      let month_array = ["January", "February", "March", "April", "May", "June","July", 
        "August", "September", "October", "November", "December"];

      let today = new Date(value);
      let date = today.getDate();
      let month = today.getMonth();
      let year = today.getFullYear();
      let hour = today.getHours();
      let minutes = today.getMinutes();
      let mid = 'PM';

      if (minutes < 10) {
        minutes = "0" + minutes;
      }

      if(hour < 12) {
        mid = 'AM';
      }

      if (hour > 12) {
        hour = hour - 12;
      }    
      if(hour==0){ 
        hour=12;
      }

	    return month_array[month]+" "+date+", "+year;

    }

    const handleTimeFormat = (value , data = null) => {

      let today = new Date(value);
      let hour = today.getHours();
      let minutes = today.getMinutes();
      let mid = 'PM';

      if (minutes < 10) {
        minutes = "0" + minutes;
      }

      if(hour < 12) {
        mid = 'AM';
      }

      if (hour > 12) {
        hour = hour - 12;
      }    
      if(hour==0){ 
        hour=12;
      }

      if(value) {
        if(data == '0:0:0')
          return data;
        else
        return hour+":"+minutes+mid;
      }
      else{
        return "";
      }

    }

    const handleScreenshot = async (value) => {

      setScreenShot(null);

      let sampleDate = new Date(value);

      let ScreenData = {
        'date' : sampleDate , 
      }

      const resScreen = await APIServices.post({ url: '/employee-module/fetch-screenshots' , payload : ScreenData })
      setScreenShot( resScreen?.data?.timesheet )

    }

    const handleTotalTime = (value) =>{

      if(value.charAt(0) != '-'){
        // return value + " " + value.indexOf(':',3);
  
        let mins = "0";
  
        if (value.slice(value.indexOf(':') + 1, value.indexOf(':',3)) >=10)  {
          mins = value.slice(value.indexOf(':') + 1, value.indexOf(':',3)); 
        }
        else if(value.slice(value.indexOf(':') + 1, value.indexOf(':',3)) < 10 && value.slice(value.indexOf(':') + 1, value.indexOf(':',3)) >= 1 ) {
          mins = "0" + value.slice(value.indexOf(':') + 1, value.indexOf(':',3));
        }
        else {
          mins = "00"; 
        }
  
        let hrs = "00";
  
        if(value.slice(0, value.indexOf(':')) >=10){
          hrs = value.slice(0, value.indexOf(':'));
        }
        else if(value.slice(0, value.indexOf(':')) < 10){
          hrs = "0" + value.slice(0, value.indexOf(':'));
        }
        else{
          hrs = "00";
        }
  
  
        return hrs + ":" + mins;
  
      }
      else{
        return "";
      }

    }

    const handleImageDisplay = ( id ,image ) => {
      setImageSelected(null)
      setOpenModal(true)
      setImageSelected( `${DefaultAPIRoute}/uploads/timesheets/${id}/${image}` )
    }
  
    return (
      <React.Fragment>

        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>

        { sized > 689 ? 
            <React.Fragment>
                <TableCell> <span className='text-[#12372A] font-bold  text-xs font-kodeFont'>{ handleDateFormat( row?.date ) }</span></TableCell>
                <TableCell ><Chip label={ handleTimeFormat(row?.time_from , row?.hours ) }  color="success" variant="outlined" /> </TableCell>
                <TableCell ><Chip label={ handleTimeFormat(row?.time_to , row?.hours ) }  color="success" variant="outlined" /> </TableCell>
                <TableCell ><Chip label={ handleTotalTime( row?.hours ) }  color="success" variant="contained" /> </TableCell> 
            </React.Fragment> 

            :

            <TableCell> 
                <div className='w-full flex flex-col gap-2'>
                    <span className='text-[#12372A] font-bold  text-xs font-kodeFont'>{ handleDateFormat( row?.date ) }</span>

                    <div className='flex flex-row gap-2 items-center'>

                        <div className='flex flex-row gap-2 items-center'>
                            <span className='text-[#12372A] text-xs font-kodeFont'>Time-In : </span>
                            <span className='text-[#12372A] text-sm font-bold font-kodeFont'>{ handleTimeFormat(row?.time_from , row?.hours ) }</span>
                        </div>

                        <div className='flex flex-row gap-2 items-center'>
                            <span className='text-[#12372A] text-xs font-kodeFont'>Time-Out : </span>
                            <span className='text-[#12372A] text-sm font-bold font-kodeFont'>{ handleTimeFormat(row?.time_to , row?.hours ) }</span>
                        </div>

                    </div>

                    <div className='flex flex-row gap-2 items-center'>
                        <span className='text-[#12372A] text-xs font-kodeFont'>Total Hours: </span>
                        <Chip label={ handleTotalTime( row?.hours ) }  color="success" variant="contained" />
                    </div>
                </div> 
            </TableCell> 
        }

          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        </TableRow>

        <ModalContent width='w-9/12' icons={<IoImageOutline  line/>} open={openModal} handleClose={setOpenModal} title={"View Screenshot"}>

            <div className='w-full flex flex-col items-center justify-center mt-10'>
              <img className='w-[100%] h-[100%] max-w-[600px] max-h-[600px] cursor-pointer' src={imageSelected} alt=""/>
            </div>

            <div className='w-full flex flex-row gap-2 justify-end items-center my-5'>

                <Button variant="contained" color="success"  onClick={ () => setOpenModal(false)}>
                    <div className='w-full flex flex-row gap-2 items-center'>
                        <span className='text-white font-semibold font-kodeFont'>Close</span>
                        <span className='text-white font-semibold font-kodeFont'><IoImageOutline/></span>
                    </div>
                </Button>
            </div>

        </ModalContent>

        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>

                <div className='w-full flex flex-row justify-between items-center'>

                  <Typography variant="h6" gutterBottom component="div">
                    Screenshots
                  </Typography>

                  <div className='flex flex-col items-center justify-center' >

                    <div onClick={ () => handleScreenshot( row?.date ) } className='flex flex-col items-center justify-center bg-[#2e7d32] px-4 py-2 rounded cursor-pointer'>
                      <span className='text-white text-md font-bold font-kodeFont'>Load ScreenShot</span>
                    </div>

                  </div>

                </div>

                <div className='w-full flex flex-row justify-start items-center flex-wrap gap-3 my-3'>
                  { screenShot?.map((row) => (
                    <img onClick={ () => handleImageDisplay(row?.profile_id , row?.file_name ) } className='w-[30%] h-[30%] cursor-pointer' src={`${DefaultAPIRoute}/uploads/timesheets/${row?.profile_id}/${row?.file_name}`} alt=""/>
                  ))}
                </div>


                { screenShot?.length === 0 ? 
                  <div className='w-full flex flex-col items-center justify-center my-3'>
                    <Alert severity="info">Screenshot not available</Alert>
                  </div>
              
                :null}

              </Box>
            </Collapse>
          </TableCell>
        </TableRow>

      </React.Fragment>
    );
  }

const Timesheets = () => {

    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = React.useState(0);

    const containerRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(null);

    const [ timeSheet , setTimeSheets ] = useState(null);

    const handleResize = () => {
        if (containerRef.current) {
          const width = containerRef.current.getBoundingClientRect().width;
          setContainerWidth(width);
        }
    };
    
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        // Initial check on mount
        handleResize();
    
        // Add event listener for window resize
        window.addEventListener('resize', handleResize);
    
        // Clean up the event listener on component unmount
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, [containerRef]);

      useEffect(() => {

        handleUserTicket();
      
      }, []);
    
      const handleUserTicket = async ( custom_from = null , custom_to = null ) => {
        
        let data;
        let from = '';
        let to = '';
        let month  ='';
        let first_month  ='';
        let first_day  ='';
        let last_month  ='';
        let last_day  ='';

        if( custom_from &&  custom_to ) {

          if(parseInt(custom_from.getMonth() + 1) < 10) first_month = "0" + parseInt(custom_from.getMonth() + 1);
          else first_month = parseInt(custom_from.getMonth() + 1);
    
          if(custom_from.getDate() < 10){
            first_day = "0"+custom_from.getDate();
          }
          else{
            first_day = custom_from.getDate();
          }
    
          if(parseInt(custom_to.getMonth() + 1) < 10) last_month = "0" + parseInt(custom_to.getMonth() + 1);
          else last_month = parseInt(custom_to.getMonth() + 1);
    
          if(custom_to.getDate() < 10){
            last_day = "0"+custom_to.getDate();
          }
          else{
            last_day = custom_to.getDate();
          }
    
          from = custom_from.getFullYear() + "-" + first_month + "-" + first_day;
          to = custom_to.getFullYear() + "-" + last_month + "-" + last_day;

        } else {

          let date_today = new Date();


          let format = new Date(date_today.getFullYear(), parseInt(date_today.getMonth() + 1), 0);

          if(parseInt(format.getMonth() + 1) < 10) month = "0" + parseInt(format.getMonth() + 1);

          else month = parseInt(format.getMonth() + 1);

          if(date_today.getDate() > 15){

            from = format.getFullYear() + "-" + month + "-" + 16;
            to = format.getFullYear() + "-" + month + "-" + format.getDate();

          }
          else{
            from = format.getFullYear() + "-" + month + "-" + "0" +1;
            to = format.getFullYear() + "-" + month + "-" + 15;
          }

        }

        
        data = {
          'from' : from , 
          'to' : to,
        }

        const res = await APIServices.post({ url: '/employee-module/fetch-time-sheets' , payload : data })
        setTimeSheets( res?.data?.timesheet);
    
      }

      const [ handleOpen , setHandleOpen ] = useState(false);

  return (
    <div className='h-full w-full flex flex-col gap-2 mb-10' ref={containerRef}>

      <DateRangeUI 
        openModal = {handleOpen} 
        toggleModal = {setHandleOpen}
        handleUserTicket = { handleUserTicket }
      />

        <div className='w-full flex flex-row items-center justify-between gap-2 my-2'>

            <span className='text-[#12372A] font-medium font-kodeFont'>Timelogs / <span className='font-bold' >Timesheets</span></span>

            <div className='flex flex-row items-center gap-3 max-[500px]:items-end'>

                <Button variant="contained" color="success" onClick={ () => setHandleOpen(true) }>
                    <CalendarTodayIcon />
                </Button>

            </div>

        </div>

        <TableContainer component={Paper}>

        <Table aria-label="collapsible table">

            { containerWidth > 689 ? 
            <TableHead>

                <TableRow>

                    <TableCell>Date</TableCell>
                    <TableCell>Time-In</TableCell>
                    <TableCell>Time-Out</TableCell>
                    <TableCell>Total Hours</TableCell>
                    <TableCell>Actions</TableCell>

                </TableRow>

            </TableHead> : null }

            <TableBody>

                {(rowsPerPage > 0
                    ? timeSheet?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : timeSheet
                )?.map((row) => (
                    <Row key={row.id} row={row} sized={containerWidth} />
                ))}

            </TableBody>

            <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 15, { label: 'All', value: -1 }]}
                colSpan={12}
                count={timeSheet?.length}
                rowsPerPage={rowsPerPage}
                page={page}
                slotProps={{
                  select: {
                    inputProps: {
                      'aria-label': 'rows per page',
                    },
                    native: true,
                  },
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>

        </Table>

    </TableContainer>
      
    </div>
  )
}

export default Timesheets
