import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepContent from '@mui/material/StepContent'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import 'react-date-range/dist/styles.css' // main style file
import 'react-date-range/dist/theme/default.css' // theme css file
import { DateRange } from 'react-date-range'
import { IoCalendarOutline, IoSendOutline } from 'react-icons/io5'
import { Alert, duration, StepButton, Typography } from '@mui/material'
import ModalContent from '../../../component/Modal/ModalContent'
import { APIServices } from '../../../hooks/fetchAPI'
import { employmentStatus as employmentStatusData } from '../../../contants'
import { ColorlibStepIcon } from '../../../contants'
import { SpaceBar } from '@mui/icons-material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { parse } from 'date-fns'
import { useSelector } from 'react-redux'

const CreateRequest = ({
  openModal,
  toggleModal,
  leaveTypes,
  handleLeaveTypes,
  leaveDuration,
  handleLeaveDuration,
  leaveDescription,
  setLeaveDescription,
  setHandleOpens,
  handleLeaveSubmit,
  successTrigger,
  errorTrigger,
  alertMessage,
  isLoading,
  daysApplied,
  includeWeekends,
  setIncludeWeekends,
  leaveBalance,
  message,
  setLeaveData,
  leaveData,
  thisYear
}) => {
  const leaveType = leaveBalance.find(item => item.id === leaveTypes)
  const [showDetails, setShowDetails] = useState(false) // State to manage visibility

  const steps = ['Leave Type & Reason', 'Leave Duration']

  const [handleType, setHandleType] = useState(false)
  const [msg, setMsg] = useState('')
  const [handleStatus, setHandleStatus] = useState(false)
  const [dateDropdownValues, setDateDropdownValues] = useState({})

  const [activeStep, setActiveStep] = React.useState(0)
  const [completed, setCompleted] = React.useState({})
  const [selectedDayTypes, setSelectedDayTypes] = useState({})
  const emplopyeeResponses = useSelector(state => state.employee.action)
  const employee = emplopyeeResponses?.employeeResponse?.data?.payload
  const [alertTypeMessage, setAlertMessage] = useState('')
  const [maternityID, setMaternityId] = useState()
  const [paternityID, setPaternityId] = useState()

  const [error, setError] = useState(false)

  const totalSteps = () => {
    return steps.length
  }

  const completedSteps = () => {
    return Object.keys(completed).length
  }

  const isLastStep = () => {
    return activeStep === totalSteps() - 1
  }

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps()
  }

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1
    setActiveStep(newActiveStep)
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleStep = step => () => {
    setActiveStep(step)
  }

  const handleComplete = () => {
    setCompleted({
      ...completed,
      [activeStep]: true
    })
    handleNext()
  }

  const handleReset = () => {
    setCompleted({})
  }

  const [rangeDate, setRangeDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ])

  const handleIncludeWeekendsChange = event => {
    setIncludeWeekends(event.target.checked)
  }

  useEffect(() => {
    if (rangeDate[0].startDate && rangeDate[0].endDate) {
      initializeLeaveData(
        rangeDate[0].startDate,
        rangeDate[0].endDate,
        includeWeekends
      )
    }
  }, [rangeDate, includeWeekends])

  useEffect(() => {
    setActiveStep(0)
    handleTypeData()
  }, [])

  useEffect(() => {
    setShowDetails(false)
  }, [leaveTypes])

  const handleTypeData = async () => {
    setError(false)

    const res = await APIServices.get({
      url: '/leave-employee-module/leave-type-dropdown',
      payload: {
        user_id: parseInt(employee?.id)
      }
    })

    if (res.status === 200 && res?.data?.error === false) {
      setHandleType(res?.data || [])
      const maternityLeave = res?.data?.data?.find(
        type => type.leave_type_name === 'Maternity Leave'
      )
      const paternityLeave = res?.data?.data?.find(
        type => type.leave_type_name === 'Paternity Leave'
      )

      setMaternityId(maternityLeave?.leave_type_id)
      setPaternityId(paternityLeave?.leave_type_id)
    } else {
      setError(true)
      setAlertMessage(res?.data.message)
    }
  }

  console.log(
    'test',
    maternityID,
    leaveTypes,
    leaveTypes === maternityID || leaveTypes === paternityID
  )

  useEffect(() => {
    if (openModal) {
      setRangeDate([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: 'selection'
        }
      ])

      setLeaveData([])
      setLeaveDescription('')
      setShowDetails(false)
      setActiveStep(0)
    }
  }, [openModal])

  useEffect(() => {
    if (
      rangeDate &&
      rangeDate[0] &&
      rangeDate[0].startDate &&
      rangeDate[0].endDate
    ) {
    }
    setError(false)
    handleTypeData()
  }, [rangeDate])

  const handleSelect = ranges => {
    setRangeDate([ranges.selection])
    handleLeaveDuration(ranges)
  }

  const initializeLeaveData = (startDate, endDate, includeWeekends) => {
    const defaultDuration = 8

    const numDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1

    const datesArray = new Array(numDays)
      .fill(0)
      .map((_, idx) => {
        const currentDate = new Date(
          startDate.getTime() + idx * (1000 * 60 * 60 * 24)
        )
        const dayOfWeek = currentDate.getDay()

        if (!includeWeekends && (dayOfWeek === 0 || dayOfWeek === 6)) {
          return null
        }

        const formattedDate = currentDate.toISOString().split('T')[0]
        return { date: formattedDate, duration: defaultDuration }
      })
      .filter(date => date !== null)

    setLeaveData(datesArray)
  }

  const handleDropdownChange = (date, value) => {
    const newValue = value || 8

    // Update the dropdown values
    setDateDropdownValues(prev => ({
      ...prev,
      [date]: newValue
    }))

    const formattedDate = new Date(date).toISOString().split('T')[0]

    // Update the leave data
    setLeaveData(prevState => {
      const existingIndex = prevState.findIndex(
        item => item.date === formattedDate
      )

      if (existingIndex > -1) {
        // Update the duration in the existing entry
        const updatedArray = [...prevState]
        updatedArray[existingIndex].duration = newValue
        return updatedArray
      } else {
        // Add a new entry with the formatted date and duration
        return [
          ...prevState,
          { date: formattedDate, duration: parseFloat(newValue) }
        ]
      }
    })
  }

  const handleDayTypeChange = (date, value) => {
    setSelectedDayTypes(prevState => ({
      ...prevState,
      [date]: value
    }))
  }

  const [handleDayType, setHandleDayType] = useState([
    { value: 1, name: '1' },
    { value: 2, name: '2' },
    { value: 3, name: '3' },
    { value: 4, name: '4' },
    { value: 5, name: '5' },
    { value: 6, name: '6' },
    { value: 7, name: '7' },
    { value: 8, name: '8' }
  ])

  return (
    <ModalContent
      icons={<IoCalendarOutline />}
      open={openModal}
      handleClose={toggleModal}
      title={'Create Leave Request'}
    >
      <Box
        sx={{
          margin: '4 auto',
          padding: '8px'
        }}
      >
        <Stepper
          nonLinear
          activeStep={activeStep}
          sx={{
            '& .MuiStepConnector-line': {
              borderTopWidth: '2px'
            },
            '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
              borderColor: 'green'
            },
            '& .MuiStepLabel-label': {
              fontSize: 16
            },
            '& .MuiStepIcon-root': {
              width: 35,
              height: 35,
              color: 'gray'
            },
            '& .MuiStepIcon-root.Mui-active': {
              color: '#12372A'
            },
            '& .MuiStepIcon-root.Mui-completed': {
              color: '#1b5e20'
            }
          }}
        >
          {steps.map((label, index) => (
            <Step
              StepIconComponent={ColorlibStepIcon}
              key={label}
              completed={completed[index]}
            >
              <StepButton color='inherit' onClick={handleStep(index)}>
                {label}
              </StepButton>
            </Step>
          ))}
        </Stepper>
        <div>
          {allStepsCompleted() ? (
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you&apos;re finished
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button onClick={handleReset}>Reset</Button>
              </Box>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {activeStep === 0 && (
                <Box
                  sx={{
                    width: '100%',
                    maxWidth: '600px',
                    margin: '0 auto',
                    padding: '16px'
                  }}
                >
                  {activeStep === 0 && (
                    <React.Fragment>
                      <Box sx={{ mb: 2 }}>
                        <span className='text-black font-semibold text-sm font-kodeFont '>
                          Select Leave Type
                        </span>
                        <div className='w-full flex flex-col items-start justify-start mt-3'>
                          <TextField
                            id='outlined-select-leave-type'
                            select
                            label='Leave Type'
                            helperText='Please select leave type'
                            color='success'
                            fullWidth
                            value={leaveTypes}
                            onChange={handleLeaveTypes}
                          >
                            {handleType?.data?.map(option => (
                              <MenuItem
                                key={option?.leave_type_id}
                                value={option?.leave_type_id}
                              >
                                {option?.leave_type_name}
                              </MenuItem>
                            ))}
                          </TextField>
                        </div>
                      </Box>
                      <Box>
                        <span className='text-black font-semibold text-sm font-kodeFont'>
                          Add Leave Reason
                        </span>
                        <div className='w-full flex flex-col items-start justify-start mt-3'>
                          <TextField
                            id='outlined-multiline-flexible'
                            label='Reason'
                            multiline
                            color='success'
                            maxRows={10}
                            value={leaveDescription}
                            onChange={e => setLeaveDescription(e.target.value)}
                            variant='outlined'
                            fullWidth
                          />
                        </div>
                      </Box>

                      <br />
                      {error ? (
                        <Alert severity='info'>
                          {
                            'No leave type credentials found, please contact HR.'
                          }
                        </Alert>
                      ) : null}
                    </React.Fragment>
                  )}
                </Box>
              )}
              {activeStep === 1 && (
                <React.Fragment>
                  <Box
                    sx={{
                      width: '100%',
                      maxWidth: '600px',
                      margin: '0 auto',
                      padding: '18px'
                    }}
                  >
                    <div className='w-full flex flex-col items-start justify-start'>
                      {showDetails ? null : (
                        <React.Fragment>
                          <span className='text-black font-semibold text-sm font-kodeFont '>
                            Select Leave Duration
                          </span>
                          <div className='w-full flex flex-col items-center'>
                            <div className='flex flex-col justify-center mt-2'>
                              <DateRange
                                editableDateInputs={true}
                                onChange={item => handleSelect(item)}
                                moveRangeOnFirstSelection={false}
                                ranges={rangeDate}
                                rangeColors={['#2e7d32']}
                              />
                            </div>
                          </div>

                          <div className='w-full flex flex-col items-center'>
                            <span className='text-black text-sm font-kodeFont'>
                              {'No. of days applied: '} {daysApplied}
                            </span>
                          </div>
                          <div className='w-fulll flex flex-row items-center'>
                            <Checkbox
                              color='success'
                              checked={includeWeekends}
                              onChange={handleIncludeWeekendsChange}
                            />
                            <span className='text-black font-semibold text-sm font-kodeFont'>
                              Include Weekends
                            </span>
                          </div>
                          <div className='w-fulll flex flex-row justify-start'>
                            <SpaceBar />

                            <span className='text-black text-xs font-kodeFont'>
                              Check this box if you want to include weekends in
                              the leave duration
                            </span>
                          </div>
                        </React.Fragment>
                      )}
                      {!(
                        leaveTypes === maternityID || leaveTypes === paternityID
                      ) && (
                        <div className='w-full flex flex-col items-center mt-2'>
                          <Button
                            variant='text'
                            color='success'
                            size='small'
                            onClick={() => setShowDetails(!showDetails)}
                          >
                            {showDetails ? 'Hide Details' : 'See Details Below'}
                            {showDetails ? (
                              <ExpandLessIcon />
                            ) : (
                              <ExpandMoreIcon />
                            )}
                          </Button>
                        </div>
                      )}

                      {showDetails && (
                        <React.Fragment>
                          <div className='w-full flex flex-col items-start my-2'>
                            <span className='text-black font-semibold text-sm font-kodeFont '>
                              Set Leave Hours Duration
                            </span>
                          </div>
                          <div className='w-full grid grid-cols-2 max-[1000px]:grid-cols-3 max-[550px]:grid-cols-1 items-center justify-around gap-3'>
                            {rangeDate[0].startDate &&
                              rangeDate[0].endDate &&
                              new Array(
                                (rangeDate[0].endDate -
                                  rangeDate[0].startDate) /
                                  (1000 * 60 * 60 * 24) +
                                  1
                              )
                                .fill(0)
                                .map((_, idx) => {
                                  const currentDate = new Date(
                                    rangeDate[0].startDate.getTime() +
                                      idx * (1000 * 60 * 60 * 24)
                                  )

                                  const dayOfWeek = currentDate.getDay() // Get the day of the week (0 for Sunday, 6 for Saturday)

                                  if (
                                    !includeWeekends &&
                                    (dayOfWeek === 0 || dayOfWeek === 6)
                                  ) {
                                    return null // Skip this date if it's a weekend and weekends are not included
                                  }

                                  const formattedDate =
                                    currentDate.toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })

                                  return (
                                    <div
                                      key={formattedDate}
                                      className='w-full flex flex-row flex-wrap min-w-48 items-center justify-center p-2 border rounded border-gray-300'
                                    >
                                      <div className='flex flex-row items-center '>
                                        <div className='flex flex-row'>
                                          <span className='text-sm text-black font-bold'>
                                            {formattedDate}
                                          </span>
                                        </div>

                                        <div className='w-full'>
                                          <TextField
                                            select
                                            label='Select Hours'
                                            helperText='Please select total hours'
                                            value={
                                              dateDropdownValues[currentDate] ||
                                              '8'
                                            }
                                            onChange={e => {
                                              handleDropdownChange(
                                                currentDate,
                                                e.target.value
                                              )
                                            }}
                                            style={{ marginLeft: '10px' }}
                                          >
                                            {handleDayType?.map(option => (
                                              <MenuItem
                                                key={option?.value}
                                                value={option?.value}
                                              >
                                                {option?.name}
                                              </MenuItem>
                                            ))}
                                          </TextField>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                })}
                          </div>
                        </React.Fragment>
                      )}

                      {/* {leaveTypes &&
                      checkLeaveDays(leaveTypes, daysApplied, leaveBalance) ? (
                        <Alert severity='warning'>
                          {`Insufficient ${leaveType.name} remaining balance is `}
                          <strong>
                            {leaveType.max_days - leaveType.count}
                          </strong>
                        </Alert>
                      ) : null} */}
                    </div>
                  </Box>
                </React.Fragment>
              )}
              <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <Button
                  color='success'
                  variant='outlined'
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                {!isLastStep() && (
                  <Button
                    variant='outlined'
                    color='success'
                    onClick={handleNext}
                    sx={{ mr: 1 }}
                    disabled={!leaveDescription ? true : false}
                  >
                    {isLastStep() ? '' : 'Next'}
                  </Button>
                )}
                {activeStep === 1 && (
                  <Box>
                    <div className='w-full flex flex-col items-end '>
                      <Button
                        color='success'
                        variant='contained'
                        size='large'
                        onClick={() => handleLeaveSubmit()}
                        endIcon={<IoSendOutline />}
                      >
                        Submit
                      </Button>
                    </div>
                  </Box>
                )}
              </Box>
              <div className='flex mt-4 ml-3'>
                {' '}
                <span className='text-[#12372A] text-sm font-normal font-kodeFont'>
                  <strong>Note:</strong> This leave request will reflect in the
                  year <strong>{thisYear}</strong> upon approval.
                </span>
              </div>
            </React.Fragment>
          )}
        </div>

        {errorTrigger ? <Alert severity='error'>{alertMessage}</Alert> : null}
        {successTrigger ? (
          <Alert severity='success'>{alertMessage}</Alert>
        ) : null}
      </Box>
    </ModalContent>
  )
}

export default CreateRequest
