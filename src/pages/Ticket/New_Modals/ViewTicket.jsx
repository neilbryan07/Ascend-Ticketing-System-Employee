import React , { useRef, useEffect, useState } from 'react'

import Button from '@mui/material/Button';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

import { IoSendOutline , IoTicketOutline } from "react-icons/io5";
import CircularProgress from '@mui/material/CircularProgress';

import Divider from '@mui/material/Divider';

import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Tooltip from '@mui/material/Tooltip';

import ModalContent from '../../../component/Modal/ModalContent';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import IconButton from '@mui/material/IconButton';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import LinearProgress from '@mui/material/LinearProgress';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

import imageCompression from 'browser-image-compression';

import { styled } from '@mui/material/styles';

import { APIServices } from '../../../hooks/fetchAPI';

import ImageViewer from './ImageViewer';

import { useSelector } from 'react-redux';

import { convertToBase64 , DefaultAPIRoute , renameFile , validateFileType , isPDF , DefaultUploadPathTickets } from '../../../contants';

const ViewTicket = React.memo( ({ 
        openModal = null , 
        toggleModal = null ,  
        setHandleOpens = null ,  
        handleTicketSubmit = null , 
        isLoading = null , 
        department_id = null , 
        rowData = null , 
        handleTicketStatusSubmit = null ,  
        handleTopicData = null ,    
        employee = null,
        handleDateFormat
    }) => {

    const [ handleTicketStatus , setHandleTicketStatus ] = useState([
        { id : 1 , name : "Open" },   
        { id : 2 , name : "Pending" },  
        { id : 3 , name : "Closed" },   
    ]);

    const fileInputRef = useRef(null);
    const endOfMessagesRef = useRef(null);

    const emplopyeeResponses = useSelector((state) => state.employee.action);
    const employeeAppData = emplopyeeResponses?.employeeResponse?.data?.payload;

    const [ statusValue, setStatusValue] = useState(null);
    const [ isUrgent , setIsUrgent ] = useState(false);
    const [value, setValue] = useState('2');
    const [ resolution , setResolution ] = useState(null);
    const [ comment , setComment ] = useState(null)
    const [ fetchEmployeeComment , setFetchEmployeeComment ] = useState([])
    const [ employeeData , setEmployeeData ] = useState([]);
    const [ ticketLogData , setTicketLogData ] = useState([]);

    const [ fileBase64, setFileBase64 ] = useState(null);
    const [ fileName , setFileName ] = useState(null);

    const [ errorMessage , setErrorMessage ] = useState(false);
    const [ fileLoading , setFileLoading ] = useState(false);
    const [ commentLoading ,setCommentLoading ] = useState(false);

    const [ imageViewerFile , setImageViewerFile ] = useState(null);
    const [ imageView , setImageView ] = useState(false);

    const handleStatusChange = (event) => {
        setStatusValue(event.target.value);
        if(rowData?.date_closed) return;
        if(event.target.value === 3 ) return;
        handleTicketStatusSubmit( event.target.value  )
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleTicketLogs = async () => {


        const res = await APIServices.post({ url: '/ticket-module/get-ticket-logs' , payload: {
            "ticket_id" : rowData?.id
        } })

        setTicketLogData( res?.data?.ticket_logs )

    }

    const handleTicketUpdate = async () => {

        let data = {
            id : rowData?.id ,
            ticket_status_id : 3 ,
            resolution : resolution,
            prev_status_id : rowData?.ticketStatusDetails?.id,
        }

      
          const res = await APIServices.post({ url: '/admin-module/update-ticket' , payload: data })
      
          if( res.status === 200 ) {
      
            setResolution(null);
      
            setTimeout(() => {
                handleTopicData();
            }, 1500);
      
          } 
    }

    useEffect(() => {
        setStatusValue(rowData?.ticket_status_id);
        setIsUrgent(rowData?.is_urgent === "1" ? true : false);
        handleFetchCommentEmployee();
        setEmployeeData(employee);
        handleTicketLogs();
    }, [rowData]);

    const handleIsUrgent = async (event) => {

        setIsUrgent( event.target.checked )

        let data = {
            id : rowData?.id ,
            is_urgent : event.target.checked ? 1 : 0 ,
        }

        const res = await APIServices.post({ url: '/admin-module/update-is-urgent' , payload: data })
      
        if( res.status === 200 ) {
    
          setResolution(null);
    
          setTimeout(() => {
              handleTopicData();
          }, 1500);
    
        } 
    }
    
    const handleFetchCommentEmployee = async ( ) => {

        let data = {
            ticket_id : rowData?.id ,
            reply_id : 1,
        }

        const res = await APIServices.post({ url: '/admin-module/fetch-comment-ticket' , payload: data });
        if( res.status === 200 ) {
    
            setFetchEmployeeComment(res?.data?.ticket_comments);
      
        } 


    }

    const handleComment = async ( isEmployee = false ) => {

        setCommentLoading(true);

        let data = {
            comment : comment ,
            ticket_id : rowData?.id ,
            attachFile : fileBase64 ? fileBase64 : '' ,
            fileName : fileName ? fileName : '',
            reply_id : isEmployee ? 1 : 0,
        }

        const res = await APIServices.post({ url: '/admin-module/post-comment-ticket' , payload: data })

        if( res.status === 200 ) {
    
            setComment('');
      
            setTimeout(() => {
                handleFetchCommentEmployee();
                setFileBase64(null);
                setFileName(null);
                setCommentLoading(false);
                fileInputRef.current.value = '';

                if ( endOfMessagesRef.current !== null  ) {
                    endOfMessagesRef.current.scrollTop = endOfMessagesRef?.current?.scrollHeight;
                }
               
            }, 1000);
      
        } 
    }

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        setFileLoading(true);
        if ( !validateFileType(file)) {
            setErrorMessage(true);
            setFileLoading(false);
            return;
        } 

        setErrorMessage(false);
        const renamedFile = renameFile(file);

        if ( file?.type !== 'application/pdf' ) {
            
            const blob = new Blob([renamedFile], { type: renamedFile?.type });
            const convertedFile = new File([blob], renamedFile.name, { type: blob.type });

            try {
                
                const options = {
                    maxSizeMB: 0.2,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                };

                const compressedFile = await imageCompression(convertedFile, options);
                setFileLoading(false);
                setFileName( compressedFile?.name );
                convertToBase64( compressedFile , setFileBase64 );


            } catch (error) {
              console.error('Error compressing the image:', error);
            }

        } else {

            setFileLoading(false);
            setFileName( renamedFile?.name );
            convertToBase64( renamedFile , setFileBase64 );

        }
   
    };

    const handleButtonClick = () => {
        fileInputRef.current.click(); // Trigger the file input dialog
    };

    const handleImageViewer = ( image ) => {

        setImageViewerFile( image );
        setImageView(true);

    }


  return (
    <ModalContent icons={<IoTicketOutline/>} open={openModal} handleClose={toggleModal} title={`Ticket Status ${handleTicketStatus?.[statusValue - 1]?.name}`} width='w-6/12'>
    
    { imageViewerFile && 
        <ImageViewer
            ImageView = { imageViewerFile }
            ModalToggle = { setImageView }
            Toggle = { imageView  }
        />
    }
    
    <Box>

        <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>

                <TabList onChange={handleChange} aria-label="lab API tabs example">
                    <Tab label="Conversation" value="2" />
                    <Tab label="Details" value="1" color='#12372A' />
                    <Tab label="Logs" value="3" />
                    
                </TabList>

            </Box>

            <TabPanel value="1">

                <div className='w-full flex flex-col gap-4'>

                    <div className='w-full flex flex-row items-center justify-between'>

                        <div className='flex flex-col gap-2 justify-center'>
                            
                            <span className='text-[#12372A] text-xs font-small font-kodeFont'>Ticket </span>
                            <span className='text-[#12372A] text-sm font-bold font-kodeFont'><Chip label={`#${rowData?.id}`} color="success"/></span>

                        </div>

                        <div className='flex flex-col gap-2 justify-center'>
                            
                            <span className='text-[#12372A] text-xs font-small font-kodeFont'>Topic</span>
                            <span className='text-[#12372A] text-sm font-bold font-kodeFont'><Chip label={`${rowData?.ticketTopicDetails?.name}`} color="success" variant="outlined" /></span>

                        </div>

                        <div className='flex flex-col gap-2 justify-center'>
                            
                            <span className='text-[#12372A] text-xs font-small font-kodeFont'>SUB CATEGORY</span>
                            <span className='text-[#12372A] text-sm font-bold font-kodeFont'><Chip label={`${rowData?.ticketSubTopicDetails?.name}`} color="success" variant="outlined" /></span>

                        </div>

                    </div>

                    <div className='w-full flex flex-col gap-2'>
                        <span className='text-[#12372A] text-md font-medium font-kodeFont'>Details </span>

                        <TextField
                            InputProps={{
                                readOnly: true,
                            }}
                            multiline
                            maxRows={10}
                            variant="outlined"
                            fullWidth
                            color='success'
                            value={ rowData?.details }
       
                        />
                    </div>

                    {  rowData?.resolution &&
                        <div className='w-full flex flex-col gap-2'>
                            <span className='text-[#12372A] text-md font-medium font-kodeFont'>Resolution </span>

                            <TextField
                                InputProps={{
                                    readOnly: true,
                                }}
                                multiline
                                maxRows={10}
                                variant="outlined"
                                fullWidth
                                color='success'
                                value={ rowData?.resolution }
        
                            />
                        </div>
                    }

                    { statusValue === 3 && rowData?.resolution === null ?
                        <div className='w-full flex flex-col gap-2'>
                            <span className='text-[#12372A] text-md font-medium font-kodeFont'>Resolution </span>

                            <TextField
                                id="outlined-multiline-flexible"
                                label="Resolution"
                                multiline
                                maxRows={10}
                                variant="outlined"
                                fullWidth
                                color='success'
                                value={ resolution }
                                onChange={ event => setResolution(event.target.value) }
                                
                            />
                        </div> 
                    : null }

                    { resolution && 
                        <div className='w-full flex flex-row items-center justify-end gap-4'>
                            <Button onClick={ handleTicketUpdate } variant="contained" color='success'>Save Changes</Button>
                        </div>
                    }


                </div>

            </TabPanel>

            <TabPanel value="2">
                <div className='w-full flex flex-col gap-4'>
               
                    <div className='flex flex-col w-2/12'>
                        <span className='text-green-700 text-sm font-bold'>Conversation</span>
                    </div>
            
                { fetchEmployeeComment?.length > 0 ? 

                    <React.Fragment>

                    <div ref={endOfMessagesRef} className='w-full flex flex-col gap-3 border border-gray-300 p-2 rounded max-h-[500px] h-full overflow-y-auto'>

                        { fetchEmployeeComment?.map((option) => (
                            <React.Fragment key={ option.id }>

                                { parseInt( employeeAppData?.user_id   ) === parseInt(option?.created_by) ? 

                                    <div className='flex flex-row w-full justify-end gap-2 items-center'>

                                        <div className='w-2/6 max-w-3/6 px-4 py-2 bg-[#ECFFDC] rounded flex flex-col gap-2'>
                                            <div className='flex flex-row justify-end'>
                                                <span className='text-black font-medium text-sm'>{option?.comment}</span>
                                            </div>

                                            { isPDF( option?.attach_file ) ? 

                                                <a 
                                                    className='flex flex-col items-center' 
                                                    target='_blank' 
                                                    href={`${DefaultUploadPathTickets}/${ option?.attach_file }`} 
                                                >
                                                    <span className='text-green-600'><PictureAsPdfIcon sx={{ fontSize: 40 }}/></span>
                                                    <span className="text-xs text-green-500" >{ option?.attach_file  }</span>
                                                </a>

                                            :  
                                            
                                            <React.Fragment>
                                                { option?.attach_file &&
                                                    <img 
                                                        onClick={ () => handleImageViewer( option?.attach_file ) }
                                                        className='cursor-pointer' 
                                                        src={`${DefaultUploadPathTickets}/${ option?.attach_file }`} 
                                                        style={{ maxWidth: '100%', height: 'auto' }} 
                                                    /> 
                                                } 
                                            </React.Fragment>
                                           
                                            }

                                            <div className='flex flex-row justify-end'>
                                                <span className='text-xs text-gray-400 font-sm'>{ handleDateFormat( option?.created_at ) }</span>
                                            </div> 

                                        </div>

                                        <Tooltip title={`${option?.userProfileDetails?.first_name} ${option?.userProfileDetails?.last_name}`}>
                                            <Avatar sx={{ bgcolor: "#12372A" }}>{option?.userProfileDetails?.first_name?.charAt(0)}{option?.userProfileDetails?.last_name?.charAt(0)}</Avatar>
                                        </Tooltip>
                                        
                                    </div> 
                                    
                                    : 

                                    <div className='flex flex-row gap-2 w-full items-center'>
                                    
                                        <Tooltip title={`${option?.userProfileDetails?.first_name} ${option?.userProfileDetails?.last_name}`}>
                                            <Avatar sx={{ bgcolor: "#12372A" }}>{option?.userProfileDetails?.first_name?.charAt(0)}{option?.userProfileDetails?.last_name?.charAt(0)}</Avatar>
                                        </Tooltip>

                                        <div className='w-2/6 max-w-3/6 px-4 py-2 bg-[#ECFFDC] rounded flex flex-col gap-2'>
                                            <div className='flex flex-row justify-start'>
                                                <span className='text-black font-medium text-sm'>{option?.comment}</span>
                                            </div>


                                            { isPDF( option?.attach_file ) ? 

                                                <a 
                                                    className='flex flex-col items-center' 
                                                    target='_blank' 
                                                    href={`${DefaultUploadPathTickets}/${ option?.attach_file }`} 
                                                >
                                                    <span className='text-green-600'><PictureAsPdfIcon sx={{ fontSize: 40 }}/></span>
                                                    <span className="text-xs text-green-500" >{ option?.attach_file  }</span>
                                                </a>

                                            :  

                                                <React.Fragment>
                                                { option?.attach_file &&
                                                    <img 
                                                        onClick={ () => handleImageViewer( option?.attach_file ) }
                                                        className='cursor-pointer' 
                                                        src={`${DefaultUploadPathTickets}/${ option?.attach_file }`} 
                                                        style={{ maxWidth: '100%', height: 'auto' }} 
                                                    /> 
                                                } 
                                                </React.Fragment>

                                            }

                                            <span className='text-xs text-gray-400 font-sm'>{ handleDateFormat( option?.created_at ) }</span>
                                        
                                        </div>

                                    </div>
                                    
                                }
                                
                            </React.Fragment>
                        ))}
                
                    </div>

                    </React.Fragment> : null }

                    
                    { fileName && 
                        <div className='flex flex-col justify-start'>
                            <Chip icon={<InsertDriveFileIcon />} label={ fileName } color="success" variant="outlined" />
                        </div>
                    }

                    { errorMessage &&
                        <div className='flex flex-col justify-start'>
                            <Chip icon={<InsertDriveFileIcon />} label={ "Invalid File Format Only Image and Pdf File" } color="error" variant="outlined" />
                        </div>
                    }

                    { fileLoading && 
                        <div className='w-full flex flex-col'>
                            <span className='text-green-500 text-sm'>File Upload Loading..</span>
                            <LinearProgress color="success" />
                        </div>
                    }

                    { commentLoading && 
                        <div className='w-full flex flex-col'>
                            <LinearProgress color="success" />
                        </div>
                    }
    
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />

                    <div className='w-full flex flex-row items-center justify-between gap-4'>
                        {/* <Avatar sx={{ bgcolor: "#12372A" }}>{employee?.first_name?.charAt(0)}{employee?.last_name?.charAt(0)}</Avatar> */}

                        <TextField
                            id="outlined-multiline-flexible"
                            label="Add Message ..."
                            multiline
                            maxRows={10}
                            variant="outlined"
                            fullWidth
                            color='success'
                            value={ comment }
                            onChange={ event => setComment( event.target.value ) }
                        />

                        <Tooltip title="Upload File">
                            <IconButton color="success" size="small" onClick={ handleButtonClick }>
                                <CloudUploadIcon />
                            </IconButton >
                        </Tooltip>
               
                        { comment && <Button onClick={ () => handleComment(true) } variant="contained" color='success'>Comment</Button> }

                    </div>    

                </div>
            </TabPanel>

            <TabPanel value="3">
                <div className='w-full flex flex-col gap-4'>

                    { ticketLogData?.map((row) => ( 

                        <React.Fragment key={ row?.id }>

                            { row?.ticket_action_type === '1' ? 

                                <div className='w-full flex flex-row items-center gap-2'>

                                    <span className='text-[#12372A] text-md font-bold font-kodeFont'>{ row?.userProfileDetails?.first_name } { row?.userProfileDetails?.last_name }</span>
                                    <span className='text-[#12372A] text-md font-small font-kodeFont'>created the ticket.</span>
                                    <span className='text-[#12372A] text-sm font-bold font-kodeFont'><Chip label={`${ handleDateFormat( row?.created_at ) }`} /></span>

                                </div> : null
                            
                            }

                            { row?.ticket_action_type === '5' ? 

                                <div className='w-full flex flex-row items-center gap-2'>

                                    <span className='text-[#12372A] text-md font-bold font-kodeFont'>{ row?.userProfileDetails?.first_name } { row?.userProfileDetails?.last_name }</span>
                                    <span className='text-[#12372A] text-md font-small font-kodeFont'>owned the ticket.</span>
                                    <span className='text-[#12372A] text-sm font-bold font-kodeFont'><Chip label={`${ handleDateFormat( row?.created_at ) }`} /></span>

                                </div>: null
                            
                            }

                            
                            { row?.ticket_action_type === '2' ? 
                   
                                <div className='w-full flex flex-row items-center gap-2'>

                                    <span className='text-[#12372A] text-md font-bold font-kodeFont'>{ row?.userProfileDetails?.first_name } { row?.userProfileDetails?.last_name }</span>
                                    <span className='text-[#12372A] text-md font-small font-kodeFont'>updated the status</span>

                                    <div className='flex flex-row items-center gap-2'>

                                        <span className='text-[#12372A] text-sm font-bold font-kodeFont'>

                                            { row?.prev_status_id === '1' ? <Chip label={"Open"} color="success" variant="outlined" /> : null  }
                                            { row?.prev_status_id === '2' ? <Chip label={"Pending"} color="warning" variant="outlined" /> : null  }
                                            { row?.prev_status_id === '3' ? <Chip label={"Closed"} color="info" variant="outlined" /> : null  }
                                            
                                        </span>

                                        <span className='text-[#12372A] text-md font-small font-kodeFont'>to</span>

                                        <span className='text-[#12372A] text-sm font-bold font-kodeFont'>

                                            { row?.current_status_id === '1' ? <Chip label={"Open"} color="success" variant="outlined" /> : null  }
                                            { row?.current_status_id === '2' ? <Chip label={"Pending"} color="warning" variant="outlined" /> : null  }
                                            { row?.current_status_id === '3' ? <Chip label={"Closed"} color="info" variant="outlined" /> : null  }
                                            
                                        </span>
                                    
                                    </div>

                                    <span className='text-[#12372A] text-sm font-bold font-kodeFont'><Chip label={`${ handleDateFormat( row?.created_at ) }`} /></span>

                                </div> : null

                            }

                            <Divider/>

                        </React.Fragment>

                    ))}

                    <Divider/>

                </div>
            </TabPanel>
 
      </TabContext>
            
    </Box>
    </ModalContent>
  )
})

export default ViewTicket
