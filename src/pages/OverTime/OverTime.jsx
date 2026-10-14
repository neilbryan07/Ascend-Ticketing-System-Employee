import React , { useState , useEffect } from 'react'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableContainer from '@mui/material/TableContainer'
import TableFooter from '@mui/material/TableFooter'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import SettingsIcon from '@mui/icons-material/Settings'
import VisibilityIcon from '@mui/icons-material/Visibility';
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import { TablePaginationActions } from '../../component/Table/TablePagination'

import ViewOverTime from './Modals/ViewOverTime'
import CreateOverTime from './Modals/CreateOverTime'
import FilterOverTime from './Modals/FilterOverTime'

import { APIServices } from '../../hooks/fetchAPI'


import { handleDateOnlyFormat , handleTimeOnly } from '../../contants'


export const OverTime = () => {

  const [ toggleOT , setToggleOT ] = useState(false);
  const [ toggleCreateOT , setToggleCreateOT ] = useState(false);
  const [ toggleFilterOT , setToggleFilterOT ] = useState(false);

  const [ overTimeTypeData , setOvertimeTypeData ] = useState([]);
  const [ overTimeStatusData , setOvertimeStatusData ] = useState([]);

  const [ filterTypeOT , setFilterTypeOT ] = useState(null);
  const [ filterStatusOT , setFilterStatusOT ] = useState(null);

  const [ overTimeData , setOverTimeData ] = useState([]);

  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const [ selectedData , setSelectedData ] = useState( null );
  
  useEffect(() => {

    handleOverType()
    handleOverTimeData();
    handleOverStatus();

  }, [ ])


  const handleOverTimeData = async ( isTrue = false) => {

    let data = {
      "overtime_type" : filterTypeOT,
      "ot_status" : filterStatusOT
    };

    const res = await APIServices.post({
      url: '/employee-module/fetch-over-time',
      payload: isTrue ? null : data
    })

    setOverTimeData( res?.data?.over_time_data )

  }

  const handleOverType = async () => {

    const res = await APIServices.get({
      url: '/over-time-config-module/get-over-time-type',
    })

    if ( res?.status === 200 ) {

      const mapping = res?.data?.over_time_type?.map( e => ({ value : e.id , label :  e.name }) )
      setOvertimeTypeData( mapping )

    }

  }

  const handleOverStatus = async () => {

    const res = await APIServices.get({
      url: '/leave-admin-module/view-status',
    })

    if ( res?.status === 200 ) {

      const mapping = res?.data?.data?.map( e => ({ value : e.id , label :  e.name }) )
      setOvertimeStatusData( mapping )

    }

  }

  const handleViewData = ( data ) => {
    setSelectedData( data );
    setToggleOT( true );
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  return (
    <div className='h-full w-full flex flex-col gap-2 mb-10'>

      { toggleOT && 
        <ViewOverTime
          openModal = { toggleOT }  
          toggleModal = { setToggleOT }
          selectedData = { selectedData }
        />
      }

      { toggleFilterOT && 
        <FilterOverTime
          openModal = { toggleFilterOT }  
          toggleModal = { setToggleFilterOT }
          selectedData = { selectedData }
          overTimeTypeData = { overTimeTypeData }
          overTimeStatusData = { overTimeStatusData }
          filterTypeOT = { filterTypeOT }
          setFilterTypeOT = { setFilterTypeOT }
          filterStatusOT = { filterStatusOT }
          setFilterStatusOT = { setFilterStatusOT }
          handleOverTimeData = { handleOverTimeData }
        />
      }

      { toggleCreateOT && 
        <CreateOverTime
          openModal = { toggleCreateOT }  
          toggleModal = { setToggleCreateOT }
          overTimeTypeData = { overTimeTypeData }
          handleOverTimeData = { handleOverTimeData }
 
        />
      }
     
     <div className='w-full flex flex-row items-center justify-between max-[500px]:flex-col max-[500px]:items-end gap-2 my-2'>
        <span className='text-[#12372A] font-medium font-kodeFont'>
          TimeLogs / <span className='font-bold'>OverTime</span>
        </span>

        <div className='flex flex-row items-center gap-3 max-[500px]:items-end'>
          <Button
            variant='contained'
            color='success'
            startIcon={<AddCircleOutlineIcon />}
            onClick={ () => setToggleCreateOT(true) }
          >
            File OT
          </Button>

          <Button
            variant='outlined'
            color='success'
            onClick={ () => setToggleFilterOT(true) }
          >
            <SettingsIcon />
          </Button>
        </div>
      </div>


      
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 1100 }}
          stickyHeader
          aria-label='custom pagination table'
        >
         
            <TableHead>
              <TableRow>
                <TableCell>Date Requested</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Over Time</TableCell>
                <TableCell>Total Hours</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>

          <TableBody>
            {(rowsPerPage > 0
              ? overTimeData?.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : overTimeData
            )?.map(row => (
              <TableRow key={ row?.id }>
                
                    <TableCell component='th' scope='row'>
                      <span className='text-[#12372A] text-xs font-kodeFont'>{ handleDateOnlyFormat( row?.ot_date ) }</span>
                    </TableCell>

                    { row?.ot_status === "1" &&
                      <TableCell component='th' scope='row'>
                          <Chip label={ 'Pending' }  color="warning" variant="outlined" /> 
                      </TableCell> 
                    }

                    { row?.ot_status === "2" &&
                      <TableCell component='th' scope='row'>
                          <Chip label={ 'Approved' }  color="success" variant="outlined" /> 
                      </TableCell> 
                    }

                    { row?.ot_status === "3" &&
                      <TableCell component='th' scope='row'>
                          <Chip label={ 'Rejected' }  color="info" variant="outlined" /> 
                      </TableCell> 
                    }
    
                    <TableCell component='th' scope='row'>
                      <span className='text-[#12372A] font-bold  text-xs font-kodeFont'>{ row?.overTimeType?.name }</span>
                    </TableCell>

                    <TableCell component='th' scope='row'>
                      <Chip label={ `${ handleTimeOnly( row?.ot_time_in ) } - ${ handleTimeOnly( row?.ot_time_out ) }` }  color="success" variant="outlined" /> 
                    </TableCell>

                    <TableCell component='th' scope='row'>
                      <Chip label={ `${ row?.total_time }` }  color="success" variant="contained" /> 
                    </TableCell>

                    <TableCell component='th' scope='row'>
                      <Tooltip title='View Details'>
                        <IconButton
                          color='success'
                          size='small'
                          onClick={ () => handleViewData( row ) }
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>

              </TableRow>
            ))}
              
          </TableBody>

          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 15, { label: 'All', value: -1 }]}
                colSpan={12}
                count={ overTimeData?.length }
                rowsPerPage={ rowsPerPage }
                page={ page }
                slotProps={{
                  select: {
                    inputProps: {
                      'aria-label': 'rows per page'
                    },
                    native: true
                  }
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>

        </Table>
      </TableContainer>

      <span className='text-[#12372A] text-md font-normal font-kodeFont'>
          <strong>NOTE:</strong> Over-Time Module is in{' '}
          <strong>Work In Progress Status</strong>. Features may be incomplete or change.
          Your feedback is appreciated.
        </span>

    </div>
  )
}
