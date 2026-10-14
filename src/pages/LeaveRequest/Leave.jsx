import React, { useRef, useEffect, useState } from 'react'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
  Button,
  Divider,
  Alert,
  TextField,
  MenuItem
} from '@mui/material'

import { TablePaginationActions } from '../../component/Table/TablePagination'
import FilterRequest from './Modal/FilterRequest'
import SettingsIcon from '@mui/icons-material/Settings'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import CreateLeaveRequest from './Modal/CreateRequest'
import { RemoveRedEye } from '@mui/icons-material'
import StatusUI from '../../component/StatusUI/StatusUI'
import ViewRequest from './Modal/ViewRequest'
import { APIServices } from '../../hooks/fetchAPI'
import { getEmployeeProfile } from '../../redux/employee/employeeThunk'
import { IoCalendar } from 'react-icons/io5'
import Snackbar from '@mui/material/Snackbar'
import ModalContent from '../../component/Modal/ModalContent'
import MessageIcon from '@mui/icons-material/Message'
import { useSelector } from 'react-redux'

const LeaveRequest = () => {
  const today = new Date()
  const [employmentStatus, setEmplomentStatus] = useState(1000)
  const emplopyeeResponses = useSelector(state => state.employee.action)
  const employee = emplopyeeResponses?.employeeResponse?.data?.payload
  const [leaveDuration, setLeaveDuration] = useState(null)
  const containerRef = useRef(null)
  const [containerWidth, setContainerWidth] = useState(null)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [page, setPage] = React.useState(0)
  const [activeStep, setActiveStep] = React.useState(0)
  const [filterStatus, setFilterStatus] = useState(null)
  const [filterType, setFilterType] = useState(null)
  const [handleOpenFilter, setHandleOpenFilter] = useState(false)
  const [handleOpenView, setHandleOpenView] = useState(false)
  const [handleOpen, setHandleOpen] = useState(false)
  const [leaveType, setLeaveType] = useState(null)
  const [leaveDescription, setLeaveDescription] = useState(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isUrgent, setIsUrgent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [userLeave, setUserLeave] = useState([])
  const [leaveBalance, setLeaveBalance] = useState([])
  const [handleRemainingDays, setRemainingDays] = useState([])
  const [gender, getGender] = useState([])
  const [msg, setMsg] = useState([])
  const [rowSelectedData, setRowSelectedData] = useState([])
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [includeWeekends, setIncludeWeekends] = useState(true)
  const [daysApplied, setDaysApplied] = useState(0)
  const [noCred, setNoCred] = useState(false)
  const [thisYear, setThisYear] = useState(today.getFullYear())
  const [currentMonth, setcurrentMonth] = useState(today.getMonth() + 1)

  const [leaveData, setLeaveData] = useState([])
  const [handleType, setHandleType] = useState([])
  const [handleYear, setHandleYear] = useState([])

  const [rangeDate, setRangeDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ])

  const getStatus = stat => {
    switch (stat) {
      case '1':
        return 'Pending'
      case '2':
        return 'Approved'
      case '3':
        return 'Rejected'
      default:
        return 'default'
    }
  }

  const handleResize = () => {
    if (containerRef.current) {
      const width = containerRef.current.getBoundingClientRect().width
      setContainerWidth(width)
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handeYearData = async () => {
    const res = await APIServices.post({
      url: '/leave-employee-module/year-dropdown'
    })
    if (res.status === 200 && res?.data?.error === false) {
      setHandleYear(res?.data || [])
    } else {
      setHandleYear([])
    }
  }

  const handleTypeData = async () => {
    const res = await APIServices.get({
      url: '/leave-employee-module/leave-type-dropdown',
      payload: {
        user_id: parseInt(employee?.id)
      }
    })
    if (res.status === 200 && res?.data?.error === false) {
      setNoCred(false)
      setHandleType(res?.data || [])
    } else {
      setHandleType([])
      setNoCred(true)
    }
  }

  const handleLeaveBalance = async () => {
    const res = await APIServices.post({
      url: 'leave-employee-module/leave-stats',
      payload: {
        year: thisYear
      }
    })
    setLeaveBalance(res?.data?.data || [])
  }

  const handleUserRequest = async (isEmpty = false) => {
    let data
    if (isEmpty) {
      setFilterStatus(null)
      setFilterType(null)
      data = {
        status: null,
        leave_type: null
      }
    } else {
      data = {
        status: filterStatus,
        leave_type: filterType
      }
    }
    const res = await APIServices.post({
      url: 'leave-employee-module/leave-view',
      payload: data
    })
    setUserLeave(res?.data?.leave_details)
  }

  useEffect(() => {
    setNoCred(false)
    handleResize()

    window.addEventListener('resize', handleResize)

    // Set initial leave requests data
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [containerRef, noCred])

  const handleModalOpenFilter = () => {
    setHandleOpenFilter(true)
  }

  const handleViewModal = data => {
    setHandleOpenView(true)

    setRowSelectedData(data)
  }

  const handleModalOpen = () => {
    setActiveStep(0)
    setHandleOpen(true)
    setSuccess(false)
    setError(false)
    setLeaveType(null)
    setLeaveDuration(null)
    setLeaveDescription(null)
    setAlertMessage('')
    setEmplomentStatus(1000)
    setLeaveType('')
    setLeaveDescription(null)
    setLeaveDuration(null)
    setIncludeWeekends(false)
    setStartDate('')
    setEndDate('')
    setIsUrgent(false)
    setRangeDate([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
      }
    ])
  }

  const handleEmploymentStatus = event => {
    setEmplomentStatus(event.target.value)
    setLeaveType(null)
    setLeaveDuration(null)
    setActiveStep(1)
  }
  const handleLeaveType = async event => {
    setLeaveType(event.target.value)
    setLeaveDuration(null)
    handleNotif(leaveType)
    setActiveStep(2)
  }

  const handleNotif = leaveType => {}

  const handleSelect = ranges => {
    setLeaveDuration('True')
    setRangeDate([ranges.selection])
    setActiveStep(3)
  }

  function dateFormat (dateString) {
    // Create a Date object from the input string
    const date = new Date(dateString)

    // Extract the components
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    // Format the date as desired
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  function dateFormat2 (dateString) {
    // Create a Date object from the input string
    const date = new Date(dateString)

    // Extract the components
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    // Format the date as desired
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  const calculatedDays = leaveData.reduce((total, item) => {
    return total + item.duration
  }, 0)

  const handleLeaveSubmit = async () => {
    setIsLoading(true)
    setSuccess(false)
    setError(false)

    const data = {
      leave_type: leaveType,
      date_entries: leaveData,
      // emp_status: null,
      // start_date: dateFormat2(rangeDate?.[0]?.startDate),
      // end_date: dateFormat2(rangeDate?.[0]?.endDate),
      reason: leaveDescription,
      num_days: calculatedDays / 8,
      year: thisYear
    }

    const res = await APIServices.post({
      url: 'leave-employee-module/leave-create',
      payload: data
    })

    if (res.status === 200 && res?.data?.error === false) {
      setSuccess(true)
      setAlertMessage('Leave request submitted successfully.')
      setTimeout(() => {
        handleUserRequest()
        setIsLoading(false)
        setHandleOpen(false)
      }, 1500)
    } else {
      handleUserRequest()
      setAlertMessage(res?.data?.message)
      setIsLoading(false)
      setError(true)
    }
  }

  function dateFormat (dateString) {
    const date = new Date(dateString)
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ]
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    const dayName = dayNames[date.getDay()]
    const day = String(date.getDate()).padStart(2, '0')
    const month = monthNames[date.getMonth()]
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    // Format the date as desired
    return `${month} ${day}, ${year} ${hours}:${minutes}`
  }

  const handleIncludeWeekendsChange = event => {
    setIncludeWeekends(event.target.checked)
  }

  const calculateDaysApplied = () => {
    const { startDate, endDate } = rangeDate[0]
    let dayCount = 0
    let currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay()
      if (includeWeekends || (dayOfWeek !== 0 && dayOfWeek !== 6)) {
        dayCount++
      }
      currentDate.setDate(currentDate.getDate() + 1)
    }

    setDaysApplied(dayCount)
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  useEffect(() => {
    calculateDaysApplied()
    handleLeaveBalance()
  }, [rangeDate, includeWeekends, leaveType, thisYear])

  useEffect(() => {
    handleUserRequest()
    handleTypeData()
    handeYearData()
  }, [])

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

  return (
    <>
      <CreateLeaveRequest
        openModal={handleOpen}
        toggleModal={setHandleOpen}
        activeSteps={activeStep}
        leaveTypes={leaveType}
        setHandleOpens={setHandleOpen}
        handleLeaveTypes={handleLeaveType}
        leaveDuration={setRangeDate}
        handleLeaveDuration={handleSelect}
        leaveDescription={leaveDescription}
        setLeaveDescription={setLeaveDescription}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        handleLeaveSubmit={handleLeaveSubmit}
        handleIncludeWeekendsChange={handleIncludeWeekendsChange}
        successTrigger={success}
        errorTrigger={error}
        alertMessage={alertMessage}
        isLoading={isLoading}
        daysApplied={calculatedDays / 8}
        includeWeekends={includeWeekends}
        setIncludeWeekends={setIncludeWeekends}
        employee={gender}
        leaveBalance={leaveBalance}
        setLeaveData={setLeaveData}
        leaveData={leaveData}
        dateFormat={dateFormat}
        thisYear={thisYear}
      />

      <FilterRequest
        openModal={handleOpenFilter}
        toggleModal={setHandleOpenFilter}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterTopic={filterType}
        setFilterTopic={setFilterType}
        handleUserTicket={handleUserRequest}
        handleType={handleType}
      />
      <ViewRequest
        openModal={handleOpenView}
        toggleModal={setHandleOpenView}
        setHandleOpens={setHandleOpen}
        isLoading={isLoading}
        rowData={rowSelectedData}
        formatDate={dateFormat}
        handleTicketStatusSubmit={null}
        handleTopicData={null}
        employee={null}
        handleDateFormat={handleDateFormat}
      />

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        key={'right' + 'center'}
      />

      <div className='w-full flex flex-row items-center justify-between max-[500px]:flex-col max-[500px]:items-end gap-2 my-2'>
        <span className='text-[#12372A] font-medium font-kodeFont'>
          Timelogs / <span className='font-bold'>Leave Request</span>
        </span>
        <div className='flex flex-row items-center gap-3 max-[500px]:items-end'>
          <Button
            variant='contained'
            color='success'
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleModalOpen}
            disabled={noCred}
          >
            Create Request
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
      <div>
        <div className='w-full flex flex-col bg-white rounded px-4 py-2 gap-3'>
          <div className='w-full flex flex-row items-center justify-between max-[500px]:flex-col max-[500px]:items-end gap-2 my-2'>
            <span className='text-[#12372A] font-medium font-kodeFont'>
              <strong>Remaining Leave Balance</strong>
            </span>

            {
              //Only show if month is DEC or JAN
              !(currentMonth === 12 || currentMonth === 1) ? null : (
                <div className='flex flex-row items-center gap-3 max-[500px]:items-end'>
                  <span className='text-[#12372A] font-medium font-kodeFont'>
                    <strong>Year </strong>
                  </span>
                  <TextField
                    id='outlined-select-leave-type'
                    select
                    color='success'
                    fullWidth
                    value={thisYear}
                    onChange={e => setThisYear(e.target.value)}
                    style={{ width: '100px', height: '50px' }}
                  >
                    {handleYear?.data?.map((option, index) => (
                      <MenuItem key={index} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
              )
            }
          </div>

          <div className='w-full grid grid-cols-4 max-[1000px]:grid-cols-3 max-[550px]:grid-cols-1 items-center justify-around gap-3'>
            {leaveBalance.map((item, index) => {
              let borderColor, textColor

              if (item.total_credits === 0) {
                borderColor = 'border-blue-300'
                textColor = 'text-blue-500'
              } else if (
                item.total_credits === item.used_days &&
                item.total_credits - item.used_days === 0
              ) {
                borderColor = 'border-red-200'
                textColor = 'text-red-400'
              } else if (item.total_credits >= item.remaining_days) {
                borderColor = 'border-green-300'
                textColor = 'text-green-600'
              } else {
                borderColor = 'border-gray-400'
                textColor = 'text-black'
              }
              return (
                <div
                  key={index}
                  className={`w-full flex flex-row flex-wrap min-w-48 items-center justify-between p-2 border rounded border-gray-300`}
                >
                  <span className={`text-sm text-balck font-bold`}>
                    {item.leave_type_name}
                  </span>
                  <div className='flex flex-col items-center gap-2'>
                    {parseInt(item.total_credits) === 9999 ? (
                      <span className={`text-sm font-bold ${textColor}`}>
                        ∞
                      </span>
                    ) : (
                      <span className={`text-sm font-bold ${textColor}`}>
                        {item.remaining_days}
                      </span>
                    )}
                    <span className={`text-sm text-gray-500 font-kodeFont`}>
                      {item.used_days}{' '}
                      {parseInt(item.total_credits) === 9999
                        ? ''
                        : `/ ${item.total_credits}`}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        {noCred ? (
          <Alert severity='info'>
            {'No leave type credentials found, please file ticket for HR.'}
          </Alert>
        ) : null}
      </div>
      <div ref={containerRef}>
        <TableContainer component={Paper}>
          <Table
            sx={{ minWidth: containerWidth > 689 ? 100 : 0 }}
            stickyHeader
            aria-label='custom pagination table'
          >
            {containerWidth > 689 ? (
              <TableHead>
                <TableRow>
                  <TableCell>Request No.</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Days Applied</TableCell>
                  <TableCell>Date Requested</TableCell>
                  <TableCell>Date Approved/Rejected</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
            ) : null}

            <TableBody>
              {(rowsPerPage > 0
                ? userLeave.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : userLeave
              )?.map(request => (
                <TableRow key={request?.id}>
                  {containerWidth > 689 ? (
                    <React.Fragment>
                      <TableCell>{request?.id}</TableCell>
                      <TableCell>
                        <StatusUI
                          name={getStatus(request?.status)}
                          is_urgent={false}
                        />
                      </TableCell>
                      <TableCell>{request?.leaveTypeDetails?.name}</TableCell>
                      <TableCell>{request?.num_days}</TableCell>
                      <TableCell>{dateFormat(request?.created_at)}</TableCell>
                      <TableCell>
                        {request?.approval_date &&
                          dateFormat(request?.approval_date)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant='text'
                          color='success'
                          onClick={() => handleViewModal(request)}
                        >
                          <MessageIcon />
                        </Button>
                      </TableCell>
                    </React.Fragment>
                  ) : (
                    <div className='w-full flex flex-col px-4 my-2'>
                      <div className='border p-3 rounded flex flex-col gap-2'>
                        <div className='w-full flex flex-row items-center justify-between'>
                          <div className='flex flex-col gap-2'>
                            <span className='text-[#12372A] font-small font-kodeFont text-xs'>
                              Request No.{' '}
                              <span className='font-bold'>{request.id}</span>
                            </span>
                            <span className='text-[#12372A] font-bold font-kodeFont'>
                              {request?.leaveTypeDetails?.name}
                            </span>
                          </div>

                          <div className='flex flex-col gap-2'>
                            <StatusUI
                              name={getStatus(request?.status)}
                              is_urgent={false}
                            />
                          </div>
                        </div>

                        <Divider />

                        <div className='w-full flex flex-row justify-between items-center'>
                          <div className='flex flex-col gap-2'>
                            <span className='text-[#12372A] font-small font-kodeFont text-xs'>
                              Date Requested
                            </span>
                            <span className='text-[#12372A] font-bold font-kodeFont text-xs'>
                              {dateFormat(request?.created_at)}
                            </span>
                          </div>

                          <div className='flex flex-col gap-2'>
                            <span className='text-[#12372A] font-small font-kodeFont text-xs'>
                              Date Approved/Rejected
                            </span>
                            <span className='text-[#12372A] font-bold font-kodeFont text-xs'>
                              {request?.approval_date &&
                                dateFormat(request?.approval_date)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </TableRow>
              ))}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 15, { label: 'All', value: -1 }]}
                  colSpan={containerWidth > 689 ? 7 : 4}
                  count={userLeave.length || 0}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      'aria-label': 'rows per page'
                    },
                    native: true
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
        <br></br>

        <span className='text-[#12372A] text-sm font-normal font-kodeFont'>
          <strong>NOTE:</strong> Leave Module is in{' '}
          <strong>BETA TESTING</strong>. Features may be incomplete or change.
          Your feedback is appreciated.
        </span>
      </div>
    </>
  )
}

export default LeaveRequest
