import React, { useRef, useEffect, useState, useCallback } from 'react'

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

import {
  TicketRowsData as rows,
  TicketSubTopic as subTicket
} from '../../contants'
import { TablePaginationActions } from '../../component/Table/TablePagination'

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import SettingsIcon from '@mui/icons-material/Settings'
import Divider from '@mui/material/Divider'

import CreateTicket from './Modals/CreateTicket'

import CreateAscendTicket from './New_Modals/CreateAscendTicket'
import FilterAscendTicket from './New_Modals/FilterAscendTicket'
import ViewTicket from './New_Modals/ViewTicket'

import MessageIcon from '@mui/icons-material/Message'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import { APIServices } from '../../hooks/fetchAPI'

const HrTicket = () => {
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [activeStep, setActiveStep] = React.useState(0)

  const [handleOpen, setHandleOpen] = useState(false)
  const [handleOpenFilter, setHandleOpenFilter] = useState(false)

  const [ticketTopic, setTicketTopic] = useState(10000)
  const [ticketSubTopic, setTicketSubTopic] = useState(null)
  const [ticketDescriptionTopic, setTicketDescriptionTopic] = useState(null)
  const [isUrgent, setIsUrgent] = useState(false)
  const [subticket, setSubTicket] = useState(null)

  const [filterStatus, setFilterStatus] = useState(null)
  const [filterTopic, setFilterTopic] = useState(null)

  const [isLoading, setIsLoading] = useState(false)

  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')

  const containerRef = useRef(null)
  const [containerWidth, setContainerWidth] = useState(null)

  const [userTicket, setUserTicket] = useState(null)

  const [rowSelectedData, setRowSelectedData] = useState([])
  const [handleViewTicket, setHandleViewTicket] = useState(false)

  const handleResize = () => {
    if (containerRef.current) {
      const width = containerRef.current.getBoundingClientRect().width
      setContainerWidth(width)
    }
  }

  useEffect(() => {
    // Initial check on mount
    handleResize()

    // Add event listener for window resize
    window.addEventListener('resize', handleResize)

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [containerRef])

  useEffect(() => {
    handleUserTicket()
  }, [])

  const handleUserTicket = async (isEmpty = false) => {
    let data
    if (isEmpty) {
      setFilterStatus(null)
      setFilterTopic(null)
      data = {
        status: null,
        topic: null,
        department_id: 21
      }
    } else {
      data = {
        status: filterStatus,
        topic: filterTopic,
        department_id: 21
      }
    }

    const res = await APIServices.post({
      url: '/employee-module/fetch-user-ascend-ticket',
      payload: data
    })
    setUserTicket(res?.data?.user_ticket)
  }

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleModalOpen = () => {
    setActiveStep(0)
    setHandleOpen(true)
    setSubTicket(null)
    setTicketTopic(null)
    setTicketSubTopic(null)
    setTicketDescriptionTopic(null)
    setSuccess(false)
    setError(false)
    setAlertMessage('')
  }

  const handleModalOpenFilter = () => {
    setHandleOpenFilter(true)
  }

  const handleTicketTopic = event => {
    setTicketTopic(event.target.value)
    setTicketSubTopic(null)
    setTicketDescriptionTopic(null)
    setSubTicket(null)
    const filtered = subTicket.filter(item =>
      item.subTicketName
        .toLowerCase()
        .includes(event.target.value.toLowerCase())
    )

    setActiveStep(1)
    setSubTicket(filtered)
  }

  const handleTicketSubTopic = event => {
    setTicketSubTopic(event.target.value)
    setTicketDescriptionTopic(null)
    setActiveStep(2)
  }

  const handleTicketSubmit = async () => {
    const data = {
      ticket_topic_id: ticketTopic,
      ticket_sub_topic_id: ticketSubTopic,
      details: ticketDescriptionTopic,
      department_id: 21,
      is_urgent: isUrgent ? 1 : 0
    }
    setIsLoading(true)

    setSuccess(false)
    setError(false)
    setAlertMessage('')

    const res = await APIServices.post({
      url: '/employee-module/create-ascend-ticket',
      payload: data
    })

    if (res.status === 200 && res?.data?.is_error === false) {
      setSuccess(true)
      setAlertMessage(res?.data?.message)

      setTimeout(() => {
        handleUserTicket()
        setIsLoading(false)
        setHandleOpen(false)
      }, 1500)
    } else {
      setIsLoading(false)
      setError(false)
    }
  }

  const handleDateFormat = data => {
    if (!data) return ''

    const date = new Date(data)

    const formattedDate = date.toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })

    return formattedDate
  }

  const handleViewData = useCallback(
    data => {
      setRowSelectedData(data)
      setHandleViewTicket(true)
    },
    [handleViewTicket, rowSelectedData]
  )

  return (
    <div className='h-full w-full flex flex-col gap-2 mb-10' ref={containerRef}>
      {handleViewTicket && (
        <ViewTicket
          openModal={handleViewTicket}
          toggleModal={setHandleViewTicket}
          setHandleOpens={setHandleOpen}
          isLoading={isLoading}
          rowData={rowSelectedData}
          handleDateFormat={handleDateFormat}
        />
      )}

      <CreateAscendTicket
        department_id={21}
        openModal={handleOpen}
        toggleModal={setHandleOpen}
        activeSteps={activeStep}
        ticketTopics={ticketTopic}
        ticketSubTopics={ticketSubTopic}
        ticketDescription={ticketDescriptionTopic}
        subTickets={subticket}
        handleTicketTopics={handleTicketTopic}
        handleTicketSubTopics={handleTicketSubTopic}
        setTicketDescriptionTopics={setTicketDescriptionTopic}
        setHandleOpens={setHandleOpen}
        handleTicketSubmit={handleTicketSubmit}
        setIsUrgent={setIsUrgent}
        successTrigger={success}
        errorTrigger={error}
        alertMessage={alertMessage}
        isLoading={isLoading}
      />

      <FilterAscendTicket
        department_id={21}
        openModal={handleOpenFilter}
        toggleModal={setHandleOpenFilter}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterTopic={filterTopic}
        setFilterTopic={setFilterTopic}
        handleUserTicket={handleUserTicket}
      />

      <div className='w-full flex flex-row items-center justify-between max-[500px]:flex-col max-[500px]:items-end gap-2 my-2'>
        <span className='text-[#12372A] font-medium font-kodeFont'>
          Ticketing / <span className='font-bold'>HR Ticketing</span>
        </span>

        <div className='flex flex-row items-center gap-3 max-[500px]:items-end'>
          <Button
            variant='contained'
            color='success'
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleModalOpen}
          >
            Create Ticket
          </Button>

          <Button
            variant='outlined'
            color='success'
            onClick={handleModalOpenFilter}
          >
            <SettingsIcon />
          </Button>
        </div>
      </div>

      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: containerWidth > 689 ? 1100 : 0 }}
          stickyHeader
          aria-label='custom pagination table'
        >
          {containerWidth > 689 ? (
            <TableHead>
              <TableRow>
                <TableCell>Ticket No.</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Topic</TableCell>
                <TableCell>Initiator</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Date Created</TableCell>
                <TableCell>Date Closed</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
          ) : null}

          <TableBody>
            {(rowsPerPage > 0
              ? userTicket?.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : userTicket
            )?.map(row => (
              <TableRow key={row.id}>
                {containerWidth > 689 ? (
                  <React.Fragment>
                    <TableCell component='th' scope='row'>
                      {row?.id}
                    </TableCell>
                    <TableCell component='th' scope='row'>
                      {row?.ticketStatusDetails?.name === 'Pending' ? (
                        <Chip
                          label={row?.ticketStatusDetails?.name}
                          color='warning'
                          variant='outlined'
                        />
                      ) : null}
                      {row?.ticketStatusDetails?.name === 'Open' ? (
                        <Chip
                          label={row?.ticketStatusDetails?.name}
                          color='success'
                          variant='outlined'
                        />
                      ) : null}
                      {row?.ticketStatusDetails?.name === 'Closed' ? (
                        <Chip
                          label={row?.ticketStatusDetails?.name}
                          color='info'
                          variant='outlined'
                        />
                      ) : null}
                    </TableCell>
                    <TableCell component='th' scope='row'>
                      {row?.ticketTopicDetails?.name}
                    </TableCell>
                    <TableCell component='th' scope='row'>
                      {row?.userProfileDetails?.first_name}{' '}
                      {row?.userProfileDetails?.middle_name?.charAt(0)}.{' '}
                      {row?.userProfileDetails?.last_name}
                    </TableCell>
                    <TableCell component='th' scope='row'>
                      {row?.assignStaffDetails?.first_name}{' '}
                      {row?.assignStaffDetails?.middle_name?.charAt(0)}.{' '}
                      {row?.assignStaffDetails?.last_name}
                    </TableCell>
                    <TableCell component='th' scope='row'>
                      {handleDateFormat(row.created_at)}
                    </TableCell>
                    <TableCell component='th' scope='row'>
                      {handleDateFormat(row.date_closed)}
                    </TableCell>

                    <TableCell component='th' scope='row'>
                      <Tooltip title='View Ticket'>
                        <IconButton
                          color='success'
                          size='small'
                          onClick={() => handleViewData(row)}
                        >
                          <MessageIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </React.Fragment>
                ) : (
                  <div className='w-full flex flex-col px-4 my-2'>
                    <div className='border p-3 rounded flex flex-col gap-2'>
                      <div className='w-full flex flex-row items-center justify-between'>
                        <div className='flex flex-col gap-2'>
                          <span className='text-[#12372A] font-small font-kodeFont text-xs'>
                            Ticket No.{' '}
                            <span className='font-bold'>{row.id}</span>
                          </span>
                          <span className='text-[#12372A] font-bold font-kodeFont'>
                            {row.topic}
                          </span>
                        </div>

                        <div className='flex flex-col gap-2'>
                          {row?.ticketStatusDetails?.name === 'Pending' ? (
                            <Chip
                              label={row?.ticketStatusDetails?.name}
                              color='warning'
                              variant='outlined'
                            />
                          ) : null}
                          {row?.ticketStatusDetails?.name === 'Open' ? (
                            <Chip
                              label={row?.ticketStatusDetails?.name}
                              color='success'
                              variant='outlined'
                            />
                          ) : null}
                          {row?.ticketStatusDetails?.name === 'Closed' ? (
                            <Chip
                              label={row?.ticketStatusDetails?.name}
                              color='info'
                              variant='outlined'
                            />
                          ) : null}
                        </div>
                      </div>

                      <div className='w-full flex flex-col items-start'>
                        <span className='text-[#12372A] font-small font-kodeFont text-xs'>
                          Initiator
                        </span>
                        <span className='text-[#12372A] font-bold font-kodeFont'>
                          {row?.userProfileDetails?.first_name}{' '}
                          {row?.userProfileDetails?.middle_name?.charAt(0)}.{' '}
                          {row?.userProfileDetails?.last_name}
                        </span>
                      </div>

                      <div className='w-full flex flex-col items-start'>
                        <span className='text-[#12372A] font-small font-kodeFont text-xs'>
                          Owner
                        </span>
                        <span className='text-[#12372A] font-bold font-kodeFont'>
                          {row?.assignStaffDetails?.first_name}{' '}
                          {row?.assignStaffDetails?.middle_name?.charAt(0)}.{' '}
                          {row?.assignStaffDetails?.last_name}
                        </span>
                      </div>

                      <Divider />

                      <div className='w-full flex flex-row justify-between items-center'>
                        <div className='flex flex-col gap-2'>
                          <span className='text-[#12372A] font-small font-kodeFont text-xs'>
                            Date Created
                          </span>
                          <span className='text-[#12372A] font-bold font-kodeFont text-xs'>
                            {handleDateFormat(row.created_at)}
                          </span>
                        </div>

                        <div className='flex flex-col gap-2'>
                          <span className='text-[#12372A] font-small font-kodeFont text-xs'>
                            Date Closed
                          </span>
                          <span className='text-[#12372A] font-bold font-kodeFont text-xs'>
                            {handleDateFormat(row.date_closed)}
                          </span>
                        </div>

                        {/* <div className='flex flex-col gap-2'>
                            <span className='text-[#12372A] font-small font-kodeFont text-xs'>Due Date</span>
                            <span className='text-[#12372A] font-bold font-kodeFont text-xs'>{row.due_date}</span>
                          </div> */}
                      </div>
                    </div>
                  </div>
                )}
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={12} />
              </TableRow>
            )}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 15, { label: 'All', value: -1 }]}
                colSpan={12}
                count={userTicket?.length}
                rowsPerPage={rowsPerPage}
                page={page}
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
    </div>
  )
}

export default HrTicket
