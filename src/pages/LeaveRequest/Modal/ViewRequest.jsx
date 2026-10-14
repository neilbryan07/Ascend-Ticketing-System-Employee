import React, { useRef, useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

import {
  IoSendOutline,
  IoTicketOutline,
  IoCalendarOutline
} from 'react-icons/io5'

import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Tooltip from '@mui/material/Tooltip'

import Button from '@mui/material/Button'

import ModalContent from '../../../component/Modal/ModalContent'

import Chip from '@mui/material/Chip'

import { APIServices } from '../../../hooks/fetchAPI'
import StatusUI from '../../../component/StatusUI/StatusUI'
import { Divider, MenuItem } from '@mui/material'
import Avatar from '@mui/material/Avatar'

import ImageViewer from '../../Ticket/New_Modals/ImageViewer'

import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import IconButton from '@mui/material/IconButton'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import LinearProgress from '@mui/material/LinearProgress'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'

import imageCompression from 'browser-image-compression'

import { useSelector } from 'react-redux'

import {
  convertToBase64,
  DefaultAPIRoute,
  renameFile,
  validateFileType,
  isPDF,
  DefaultUploadPathLeave
} from '../../../contants'
import { ExpandLess, ExpandMore } from '@mui/icons-material'

const ViewRequest = React.memo(
  ({
    openModal = null,
    toggleModal = null,
    rowData = null,
    employee = null,
    formatDate = formatDate,
    handleDateFormat
  }) => {
    const [statusValue, setStatusValue] = useState(null)
    const [value, setValue] = useState('1')
    const [resolution, setResolution] = useState(null)
    const [fetchComment, setFetchComment] = useState([])
    const [employeeData, setEmployeeData] = useState([])
    const [containerWidth, setContainerWidth] = useState(null)
    const containerRef = useRef(null)
    const [showDetails, setShowDetails] = useState(false)

    const emplopyeeResponses = useSelector(state => state.employee.action)
    const employeeAppData = emplopyeeResponses?.employeeResponse?.data?.payload

    const fileInputRef = useRef(null)
    const endOfMessagesRef = useRef(null)

    const [imageViewerFile, setImageViewerFile] = useState(null)
    const [imageView, setImageView] = useState(false)

    const [comment, setComment] = useState(null)

    const [fileBase64, setFileBase64] = useState(null)
    const [fileName, setFileName] = useState(null)

    const [errorMessage, setErrorMessage] = useState(false)
    const [fileLoading, setFileLoading] = useState(false)
    const [commentLoading, setCommentLoading] = useState(false)

    const [fetchEmployeeComment, setFetchEmployeeComment] = useState([])

    const [handleDayType, setHandleDayType] = useState([
      { id: 1, name: '1' },
      { id: 2, name: '2' },
      { id: 3, name: '3' },
      { id: 4, name: '4' },
      { id: 5, name: '5' },
      { id: 6, name: '6' },
      { id: 7, name: '7' },
      { id: 8, name: '8' }
    ])

    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.getBoundingClientRect().width
        setContainerWidth(width)
      }
    }

    const handleChange = (event, newValue) => {
      setValue(newValue)
    }

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

      const day = String(date.getDate()).padStart(2, '0')
      const month = monthNames[date.getMonth()]
      const year = date.getFullYear()

      // Format the date as desired
      return `${month} ${day}, ${year}`
    }

    const handleImageViewer = image => {
      setImageViewerFile(image)
      setImageView(true)
    }

    useEffect(() => {
      setEmployeeData(employee)
    }, [])

    useEffect(() => {
      handleFetchCommentEmployee()
      setValue('1')
      setShowDetails(false)
    }, [rowData])

    const handleFileChange = async event => {
      const file = event.target.files[0]
      setFileLoading(true)
      if (!validateFileType(file)) {
        setErrorMessage(true)
        setFileLoading(false)
        return
      }

      setErrorMessage(false)
      const renamedFile = renameFile(file)

      if (file?.type !== 'application/pdf') {
        const blob = new Blob([renamedFile], { type: renamedFile?.type })
        const convertedFile = new File([blob], renamedFile.name, {
          type: blob.type
        })

        try {
          const options = {
            maxSizeMB: 0.2,
            maxWidthOrHeight: 1920,
            useWebWorker: true
          }

          const compressedFile = await imageCompression(convertedFile, options)
          setFileLoading(false)
          setFileName(compressedFile?.name)
          convertToBase64(compressedFile, setFileBase64)
        } catch (error) {
          console.error('Error compressing the image:', error)
        }
      } else {
        setFileLoading(false)
        setFileName(renamedFile?.name)
        convertToBase64(renamedFile, setFileBase64)
      }
    }

    const handleButtonClick = () => {
      fileInputRef.current.click() // Trigger the file input dialog
    }

    const handleFetchCommentEmployee = async () => {
      let data = {
        leave_id: rowData?.id
      }

      const res = await APIServices.post({
        url: '/leave-admin-module/fetch-comment-leave',
        payload: data
      })
      if (res.status === 200) {
        setFetchEmployeeComment(res?.data?.comments)
      }
    }

    const handleComment = async (isEmployee = false) => {
      setCommentLoading(true)

      let data = {
        comment: comment,
        leave_id: rowData?.id,
        attach_file: fileBase64 ? fileBase64 : '',
        file_name: fileName ? fileName : ''
      }

      const res = await APIServices.post({
        url: '/leave-admin-module/post-comment-leave',
        payload: data
      })

      if (res.status === 200) {
        setComment('')

        setTimeout(() => {
          handleFetchCommentEmployee()
          setFileBase64(null)
          setFileName(null)
          setCommentLoading(false)
          fileInputRef.current.value = ''

          if (endOfMessagesRef.current !== null) {
            endOfMessagesRef.current.scrollTop =
              endOfMessagesRef?.current?.scrollHeight
          }
        }, 1000)
      }
    }

    return (
      <ModalContent
        icons={<IoCalendarOutline />}
        open={openModal}
        handleClose={toggleModal}
        title={`Leave Request  | ${
          rowData?.userProfileDetails?.first_name
        } ${rowData?.userProfileDetails?.middle_name.charAt(0)} ${
          rowData?.userProfileDetails?.last_name
        } `}
        width='w-6/12'
      >
        <Box>
          {imageViewerFile && (
            <ImageViewer
              ImageView={imageViewerFile}
              ModalToggle={setImageView}
              Toggle={imageView}
              isLeave={true}
            />
          )}

          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList
                onChange={handleChange}
                aria-label='lab API tabs example'
              >
                <Tab label='Details' value='1' color='#12372A' />
                <Tab label='Conversation' value='2' color='#12372A' />
                <Tab label='Logs' value='3' color='#12372A' />
              </TabList>
            </Box>

            <TabPanel value='1'>
              <div className='w-full flex flex-col gap-4'>
                <div className='w-full flex flex-row items-center justify-between'>
                  <div className='flex flex-col gap-2 justofy-center'>
                    <div className='text-[#12372A] text-xs font-small font-kodeFont'>
                      Request No. {'     '}
                    </div>
                    <div className='text-[#12372A] text-sm font-bold font-kodeFont'>
                      <Chip label={rowData?.id} color='success' />
                    </div>
                  </div>

                  <div className='flex flex-col gap-2 justify-center'>
                    <div className='text-[#12372A] text-xs font-small font-kodeFont'>
                      Type
                    </div>
                    <div className='text-[#12372A] text-sm font-bold font-kodeFont'>
                      <Chip
                        label={rowData?.leaveTypeDetails?.name}
                        color='success'
                        variant='outlined'
                      />
                    </div>
                  </div>

                  <div className='flex flex-col gap-2 justify-center'>
                    <div className='text-[#12372A] text-xs font-small font-kodeFont'>
                      Date Requested
                    </div>
                    <div className='text-[#12372A] text-sm font-bold font-kodeFont'>
                      <Chip
                        label={dateFormat(rowData?.created_at)}
                        color='success'
                        variant='outlined'
                      />
                    </div>
                  </div>
                </div>

                <div className='w-full flex flex-row items-center justify-between'>
                  <div className='flex flex-col gap-2 justofy-center'>
                    <div className='text-[#12372A] text-xs font-small font-kodeFont'>
                      Status
                    </div>
                    <div className='text-[#12372A] text-sm font-bold font-kodeFont'>
                      <StatusUI
                        name={getStatus(rowData?.status)}
                        is_urgent={false}
                      />
                    </div>
                  </div>

                  <div className='flex flex-col gap-2 justofy-center'>
                    <div className='text-[#12372A] text-xs font-small font-kodeFont'>
                      Departmet
                    </div>
                    <div className='text-[#12372A] text-sm font-bold font-kodeFont'>
                      {'IT Department'}
                    </div>
                  </div>
                </div>
                <span className='text-[#12372A] text-sm font-medium font-kodeFont'>
                  Duration of Leave
                </span>
                <div className='w-full flex flex-row items-center justify-between'>
                  <div className='flex flex-col gap-2 justofy-center'>
                    <div className='text-[#12372A] text-xs font-small font-kodeFont'>
                      Start Date
                    </div>
                    <div className='text-[#12372A] text-sm font-bold font-kodeFont'>
                      {dateFormat(rowData?.start_date)}
                    </div>
                  </div>
                  <div className='flex flex-col gap-2 justofy-center'>
                    <div className='text-[#12372A] text-xs font-small font-kodeFont'>
                      End Date
                    </div>
                    <div className='text-[#12372A] text-sm font-bold font-kodeFont'>
                      {dateFormat(rowData?.end_date)}
                    </div>
                  </div>
                  <div className='flex flex-col gap-2 justofy-center'>
                    <div className='text-[#12372A] text-xs font-small font-kodeFont'>
                      No. of Days Applied
                    </div>
                    <div className='text-[#12372A] text-sm font-bold font-kodeFont'>
                      {rowData?.num_days}
                    </div>
                  </div>
                </div>

                {!(
                  rowData?.leaveTypeDetails?.id === '4' ||
                  rowData?.leaveTypeDetails?.id === '5'
                ) && (
                  <div className='w-full flex flex-col items-center mt-2'>
                    <Button
                      variant='text'
                      color='success'
                      size='small'
                      onClick={() => setShowDetails(!showDetails)}
                    >
                      {showDetails ? 'Hide Details' : 'See More Details Below'}
                      {showDetails ? <ExpandLess /> : <ExpandMore />}
                    </Button>
                  </div>
                )}
                {showDetails && (
                  <React.Fragment>
                    <div className='w-full flex flex-col items-start'>
                      <span className='text-[#12372A] text-sm font-medium font-kodeFont'>
                        Set Leave Hours Duration
                      </span>
                    </div>
                    <div className='w-full grid grid-cols-3 max-[1000px]:grid-cols-3 max-[550px]:grid-cols-1 items-center justify-around gap-3'>
                      {rowData?.leaveLogs?.map(leave => {
                        const currentDate = new Date(leave.date)

                        const formattedDate = currentDate.toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }
                        )

                        return (
                          <div
                            key={leave.id}
                            className='w-full flex flex-row flex-wrap min-w-48 items-start justify-center p-2 border rounded border-gray-300'
                          >
                            <div className='flex flex-row '>
                              <span className='text-sm text-black font-bold'>
                                {formattedDate}
                              </span>
                            </div>

                            <div className='grid w-full mt-3 p-2'>
                              <TextField
                                select
                                label='Total Hours'
                                value={leave.dayTypeId || leave.duration}
                                disabled
                              >
                                {handleDayType?.map(option => (
                                  <MenuItem key={option?.id} value={option?.id}>
                                    {option?.name}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </React.Fragment>
                )}
                <div className='w-full flex flex-col gap-2'>
                  <span className='text-[#12372A] text-md font-medium font-kodeFont'>
                    Reason{' '}
                  </span>

                  <TextField
                    InputProps={{
                      readOnly: true
                    }}
                    multiline
                    maxRows={10}
                    variant='outlined'
                    fullWidth
                    color='success'
                    value={rowData?.reason}
                  />
                </div>

                {parseInt(rowData?.status) === 1 ? null : (
                  <div className='w-full flex flex-col gap-2'>
                    <span className='text-[#12372A] text-md font-medium font-kodeFont'>
                      Remarks{' '}
                    </span>

                    <TextField
                      InputProps={{
                        readOnly: true
                      }}
                      multiline
                      maxRows={10}
                      variant='outlined'
                      fullWidth
                      color='success'
                      value={rowData?.remarks}
                    />
                  </div>
                )}

                <div className='w-full flex flex-row items-center justify-between gap-4'>
                  <div className='flex flex-col gap-3 '>
                    <div className='text-[#12372A] text-sm  font-kodeFont'>
                      <strong>Note:</strong> You are applying for leave in{' '}
                      <strong>{rowData?.year}</strong>.
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>

            <TabPanel value='3'>
              <React.Fragment key={rowData?.id}>
                <div className='w-full flex flex-col gap-4'>
                  {rowData?.showLogs?.map((row, index) => {
                    const isStatusChange = row?.action?.includes('from')
                    const match = row?.action?.match(/ from '(.+)' to '(.+)'/)
                    const oldStatus = match?.[1] // "Pending"
                    const newStatus = match?.[2] // "Approved"

                    return (
                      <React.Fragment key={index}>
                        <span className='text-[#12372A] text-md font-small font-kodeFont'>
                          <strong>
                            {row?.first_name} {row?.last_name}
                          </strong>{' '}
                          {row?.action?.replace(/'(.+)' to '(.+)'/, '')}{' '}
                          {oldStatus && (
                            <StatusUI
                              name={oldStatus}
                              is_urgent={false}
                              className='status-chip-old'
                            />
                          )}{' '}
                          {isStatusChange && 'to '}
                          {newStatus && (
                            <StatusUI
                              name={newStatus}
                              className='status-chip-new'
                            />
                          )}
                          {` `}
                          <Chip
                            label={
                              <span className='font-bold'>
                                {`${formatDate(row?.created_at)}` || ''}
                              </span>
                            }
                          />
                        </span>
                        <Divider />
                      </React.Fragment>
                    )
                  })}
                </div>
              </React.Fragment>
            </TabPanel>

            <TabPanel value='2'>
              <div className='w-full flex flex-col gap-4'>
                <div className='flex flex-col w-2/12'>
                  <span className='text-green-700 text-sm font-bold'>
                    Conversation
                  </span>
                </div>

                {fetchEmployeeComment?.length > 0 ? (
                  <React.Fragment>
                    <div
                      ref={endOfMessagesRef}
                      className='w-full flex flex-col gap-3 border border-gray-300 p-2 rounded max-h-[500px] h-full overflow-y-auto'
                    >
                      {fetchEmployeeComment?.map(option => (
                        <React.Fragment key={option.id}>
                          {parseInt(employeeAppData?.id) ===
                          parseInt(option?.created_by) ? (
                            <div className='flex flex-row w-full justify-end gap-2 items-center'>
                              <div className='w-2/6 max-w-3/6 px-4 py-2 bg-[#ECFFDC] rounded flex flex-col gap-2'>
                                <div className='flex flex-row justify-end'>
                                  <span className='text-black font-medium text-sm'>
                                    {option?.comment}
                                  </span>
                                </div>

                                {isPDF(option?.attach_file) ? (
                                  <a
                                    className='flex flex-col items-center'
                                    target='_blank'
                                    href={`${DefaultUploadPathLeave}/${option?.attach_file}`}
                                  >
                                    <span className='text-green-600'>
                                      <PictureAsPdfIcon sx={{ fontSize: 40 }} />
                                    </span>
                                    <span className='text-xs text-green-500'>
                                      {option?.attach_file}
                                    </span>
                                  </a>
                                ) : (
                                  <React.Fragment>
                                    {option?.attach_file && (
                                      <img
                                        onClick={() =>
                                          handleImageViewer(option?.attach_file)
                                        }
                                        className='cursor-pointer'
                                        src={`${DefaultUploadPathLeave}/${option?.attach_file}`}
                                        style={{
                                          maxWidth: '100%',
                                          height: 'auto'
                                        }}
                                      />
                                    )}
                                  </React.Fragment>
                                )}

                                <div className='flex flex-row justify-end'>
                                  <span className='text-xs text-gray-400 font-sm'>
                                    {handleDateFormat(option?.created_at)}
                                  </span>
                                </div>
                              </div>

                              <Tooltip
                                title={`${option?.owner?.first_name} ${option?.owner?.last_name}`}
                              >
                                <Avatar sx={{ bgcolor: '#12372A' }}>
                                  {option?.owner?.first_name?.charAt(0)}
                                  {option?.owner?.last_name?.charAt(0)}
                                </Avatar>
                              </Tooltip>
                            </div>
                          ) : (
                            <div className='flex flex-row gap-2 w-full items-center'>
                              <Tooltip
                                title={`${option?.owner?.first_name} ${option?.owner?.last_name}`}
                              >
                                <Avatar sx={{ bgcolor: '#12372A' }}>
                                  {option?.owner?.first_name?.charAt(0)}
                                  {option?.owner?.last_name?.charAt(0)}
                                </Avatar>
                              </Tooltip>

                              <div className='w-2/6 max-w-3/6 px-4 py-2 bg-[#ECFFDC] rounded flex flex-col gap-2'>
                                <div className='flex flex-row justify-start'>
                                  <span className='text-black font-medium text-sm'>
                                    {option?.comment}
                                  </span>
                                </div>

                                {isPDF(option?.attach_file) ? (
                                  <a
                                    className='flex flex-col items-center'
                                    target='_blank'
                                    href={`${DefaultUploadPathLeave}/${option?.attach_file}`}
                                  >
                                    <span className='text-green-600'>
                                      <PictureAsPdfIcon sx={{ fontSize: 40 }} />
                                    </span>
                                    <span className='text-xs text-green-500'>
                                      {option?.attach_file}
                                    </span>
                                  </a>
                                ) : (
                                  <React.Fragment>
                                    {option?.attach_file && (
                                      <img
                                        onClick={() =>
                                          handleImageViewer(option?.attach_file)
                                        }
                                        className='cursor-pointer'
                                        src={`${DefaultUploadPathLeave}/${option?.attach_file}`}
                                        style={{
                                          maxWidth: '100%',
                                          height: 'auto'
                                        }}
                                      />
                                    )}
                                  </React.Fragment>
                                )}

                                <span className='text-xs text-gray-400 font-sm'>
                                  {handleDateFormat(option?.created_at)}
                                </span>
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </React.Fragment>
                ) : null}

                {fileName && (
                  <div className='flex flex-col justify-start'>
                    <Chip
                      icon={<InsertDriveFileIcon />}
                      label={fileName}
                      color='success'
                      variant='outlined'
                    />
                  </div>
                )}

                {errorMessage && (
                  <div className='flex flex-col justify-start'>
                    <Chip
                      icon={<InsertDriveFileIcon />}
                      label={'Invalid File Format Only Image and Pdf File'}
                      color='error'
                      variant='outlined'
                    />
                  </div>
                )}

                {fileLoading && (
                  <div className='w-full flex flex-col'>
                    <span className='text-green-500 text-sm'>
                      File Upload Loading..
                    </span>
                    <LinearProgress color='success' />
                  </div>
                )}

                {commentLoading && (
                  <div className='w-full flex flex-col'>
                    <LinearProgress color='success' />
                  </div>
                )}

                <input
                  type='file'
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />

                <div className='w-full flex flex-row items-center justify-between gap-4'>
                  {/* <Avatar sx={{ bgcolor: "#12372A" }}>{employee?.first_name?.charAt(0)}{employee?.last_name?.charAt(0)}</Avatar> */}

                  <TextField
                    id='outlined-multiline-flexible'
                    label='Add Message ...'
                    multiline
                    maxRows={10}
                    variant='outlined'
                    fullWidth
                    color='success'
                    value={comment}
                    onChange={event => setComment(event.target.value)}
                  />

                  <Tooltip title='Upload File'>
                    <IconButton
                      color='success'
                      size='small'
                      onClick={handleButtonClick}
                    >
                      <CloudUploadIcon />
                    </IconButton>
                  </Tooltip>

                  {comment && (
                    <Button
                      onClick={() => handleComment(true)}
                      variant='contained'
                      color='success'
                    >
                      Comment
                    </Button>
                  )}
                </div>
              </div>
            </TabPanel>
          </TabContext>
        </Box>
      </ModalContent>
    )
  }
)

export default ViewRequest
