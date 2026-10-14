import StepConnector, {
  stepConnectorClasses
} from '@mui/material/StepConnector'
import { styled } from '@mui/material/styles'
import PropTypes from 'prop-types'
 
// export const DefaultAPIRoute = 'http://dev.ascend.local';
export const DefaultAPIRoute = 'https://ascend.nextbposolutions.com/'

export const DefaultUploadPathTickets = `${DefaultAPIRoute}/uploads/tickets/`
export const DefaultUploadPathLeave = `${DefaultAPIRoute}/uploads/leave_comments/`
export const DefaultUploadPathOverTime = `${DefaultAPIRoute}/uploads/overtime/`
 
export const TicketTopic = [
  {
    value: 'Network/Connectivity Issue',
    label: 'Network/Connectivity Issue'
  },
  { 
    value: 'Software Issue',
    label: 'Software Issue'
  },
  {
    value: 'Peripheral Issue',
    label: 'Peripheral Issue'
  },
  {
    value: 'Hardware Issue',
    label: 'Hardware Issue'
  },
  {
    value: 'Others',
    label: 'Others'
  }
]

export const TicketSubTopic = [
  {
    subTicketName: 'Network/Connectivity Issue',
    description: 'Network troubleshooting for internet related issues',
    groupData: [
      { name: 'No Internet Connection' },
      { name: 'Intermittent Connection' },
      { name: 'Unable to access network / Wifi' }
    ]
  },
  {
    subTicketName: 'Software Issue',
    description:
      'For troubleshooting, installation and uninstallation of software',
    groupData: [
      { name: 'Operating System' },
      { name: 'WFH App' },
      { name: 'Outlook' },
      { name: 'Browser' },
      { name: 'Any Apps installed on the unit' }
    ]
  },
  {
    subTicketName: 'Peripheral Issue',
    description:
      'For replacement or troubleshooting of the below sub categories',
    groupData: [
      { name: 'Printer' },
      { name: 'Mouse' },
      { name: 'Keyboard' },
      { name: 'Headset' },
      { name: 'Microphone' },
      { name: 'External Hard Drive' },
      { name: 'Bluetooth Dongle' },
      { name: 'Speaker' }
    ]
  },
  {
    subTicketName: 'Hardware Issue',
    description:
      'For replacement or troubleshooting of the below sub categories',
    groupData: [
      { name: 'System Unit' },
      { name: 'Storage' },
      { name: 'UPS' },
      { name: 'Monitor' }
    ]
  },
  {
    subTicketName: 'Others',
    description:
      'IoT devices / BYOD, Equipment requests and credential requests',
    groupData: [
      { name: 'Biometrics' },
      { name: 'Request Credentials' },
      { name: 'Laptop Deployment' },
      { name: 'Laptop Request' },
      { name: 'PC Deployment' },
      { name: 'PC Request' },
      { name: 'Mobile requests / troubleshooting' },
      { name: 'Projector Request' },
      { name: 'Speaker Request' }
    ]
  }
]

export const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.disabled}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: 'transparent'
    }
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: 'transparent'
    }
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: 'transparent'
    }
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 10,
    border: 0,
    backgroundColor: 'blue',
    borderRadius: 1
  }
}))

export const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ADBC9F',
  zIndex: 1,
  color: '#fff',
  width: 35,
  height: 35,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: 18,
  ...(ownerState.active && {
    backgroundColor: '#12372A'
  }),
  ...(ownerState.completed && {
    backgroundColor: '#1b5e20'
  })
}))

export function ColorlibStepIcon (props) {
  const { active, completed, className } = props

  const icons = {
    1: <span className='cursor-pointer'>1</span>,
    2: <span className='cursor-pointer'>2</span>,
    3: <span className='cursor-pointer'>3</span>,
    4: <span className='cursor-pointer'>4</span>
  }

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  )
}

ColorlibStepIcon.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  completed: PropTypes.bool,
  icon: PropTypes.node
}

function createData (
  id,
  status,
  topic,
  initiator,
  owner,
  date_created,
  date_closed,
  due_date
) {
  return {
    id,
    status,
    topic,
    initiator,
    owner,
    date_created,
    date_closed,
    due_date
  }
}

export const TicketRowsData = [
  createData(
    10,
    'Pending',
    'Hardware Issue',
    'Bryan Lagrimas',
    'Neil Lagrimas',
    'Feb. 20 , 2024 9:35 pm',
    'Feb. 21 , 2024 9:35 am',
    'Feb. 20 , 2024 9:35 am'
  ),
  createData(
    11,
    'Open',
    'Software Issue',
    'Bryan Lagrimas',
    'Neil Lagrimas',
    'Feb. 20 , 2024 9:35 pm',
    'Feb. 21 , 2024 9:35 am',
    'Feb. 20 , 2024 9:35 am'
  ),
  createData(
    12,
    'Closed',
    'Network Issue',
    'Kitsune',
    'Kitsune',
    'Feb. 20 , 2024 9:35 pm',
    'Feb. 21 , 2024 9:35 am',
    'Feb. 20 , 2024 9:35 am'
  ),
  createData(
    13,
    'Open',
    'Network Issue',
    'Kitsune',
    'Kitsune',
    'Feb. 20 , 2024 9:35 pm',
    'Feb. 21 , 2024 9:35 am',
    'Feb. 20 , 2024 9:35 am'
  ),
  createData(
    14,
    'Closed',
    'Network Issue',
    'Kitsune',
    'Kitsune',
    'Feb. 20 , 2024 9:35 pm',
    'Feb. 21 , 2024 9:35 am',
    'Feb. 20 , 2024 9:35 am'
  ),
  createData(
    15,
    'Pending',
    'Network Issue',
    'Kitsune',
    'Kitsune',
    'Feb. 20 , 2024 9:35 pm',
    'Feb. 21 , 2024 9:35 am',
    'Feb. 20 , 2024 9:35 am'
  ),
  createData(
    16,
    'Closed',
    'Network Issue',
    'Kitsune',
    'Kitsune',
    'Feb. 20 , 2024 9:35 pm',
    'Feb. 21 , 2024 9:35 am',
    'Feb. 20 , 2024 9:35 am'
  ),
  createData(
    17,
    'Open',
    'Network Issue',
    'Kitsune',
    'Kitsune',
    'Feb. 20 , 2024 9:35 pm',
    'Feb. 21 , 2024 9:35 am',
    'Feb. 20 , 2024 9:35 am'
  ),
  createData(
    18,
    'Closed',
    'Network Issue',
    'Kitsune',
    'Kitsune',
    'Feb. 20 , 2024 9:35 pm',
    'Feb. 21 , 2024 9:35 am',
    'Feb. 20 , 2024 9:35 am'
  ),
  createData(
    19,
    'Pending',
    'Network Issue',
    'Kitsune',
    'Kitsune',
    'Feb. 20 , 2024 9:35 pm',
    'Feb. 21 , 2024 9:35 am',
    'Feb. 20 , 2024 9:35 am'
  ),
  createData(
    20,
    'Open',
    'Network Issue',
    'Kitsune',
    'Kitsune',
    'Feb. 20 , 2024 9:35 pm',
    'Feb. 21 , 2024 9:35 am',
    'Feb. 20 , 2024 9:35 am'
  ),
  createData(
    21,
    'Pending',
    'Network Issue',
    'Kitsune',
    'Kitsune',
    'Feb. 20 , 2024 9:35 pm',
    'Feb. 21 , 2024 9:35 am',
    'Feb. 20 , 2024 9:35 am'
  )
].sort((a, b) => (a.calories < b.calories ? -1 : 1))

export const LeaveType = [
  {
    value: 'Sick Leave',
    label: 'Sick Leave'
  },
  {
    value: 'Vacation Leave',
    label: 'Vacation Leave'
  },
  {
    value: 'Unpaid Leave',
    label: 'Unpaid Leave'
  },
  {
    value: 'Maternity Leave',
    label: 'Maternity Leave'
  },
  {
    value: 'Paternity Leave',
    label: 'Paternity Leave'
  },
  {
    value: 'Bereavement Leave',
    label: 'Bereavement Leave'
  },
  {
    value: 'Others',
    label: 'Others'
  }
]

export const employmentStatus = [
  {
    value: 'Probationary',
    label: 'Probationary'
  },
  {
    value: 'Regular',
    label: 'Regular'
  },
  {
    value: 'Contractual/ Project-Based',
    label: 'Contractual/ Project-Based'
  }
]

export const pageRoutes = {
  /* Authenticate */
  SPLASH: '/',
  LOGIN: '/login',

  /* Dashboard */
  TICKET: '/app/ticket',
  UTILTICKET: '/app/util-ticket',
  HRTICKET: '/app/hr-ticket',
  ACCTTICKET: '/app/acct-ticket',
  TIMESHEETS: '/app/timesheets',
  LEAVEREQUEST: '/app/leaverequest',
  OVERTIME: '/app/over-time'
}

export const particles_link = {
  autoPlay: true,
  background: {
    color: {
      value: '#12372A'
    },
    image: '',
    position: '50% 50%',
    repeat: 'no-repeat',
    size: 'cover',
    opacity: 1
  },
  backgroundMask: {
    composite: 'destination-out',
    cover: {
      color: {
        value: '#fff'
      },
      opacity: 1
    },
    enable: false
  },
  fullScreen: {
    enable: true,
    zIndex: -1
  },
  detectRetina: true,
  duration: 0,
  fpsLimit: 166,
  interactivity: {
    detectsOn: 'window',
    events: {
      onClick: {
        enable: false,
        mode: 'push'
      },
      onDiv: {
        selectors: [],
        enable: false,
        mode: [],
        type: 'circle'
      },
      onHover: {
        enable: true,
        mode: 'grab',
        parallax: {
          enable: true,
          force: 60,
          smooth: 15
        }
      },
      resize: false
    }

    // "modes": {
    //   "slow": {
    //     "factor": 3,
    //     "radius": 200
    //   },
    //   "attract": {
    //     "distance": 200,
    //     "duration": 0.4,
    //     "easing": "ease-out-quad",
    //     "factor": 1,
    //     "maxSpeed": 50,
    //     "speed": 1
    //   },
    //   "bounce": {
    //     "distance": 200
    //   },
    //   "bubble": {
    //     "distance": 400,
    //     "duration": 2,
    //     "mix": false,
    //     "opacity": 0.8,
    //     "size": 40,
    //     "divs": {
    //       "distance": 200,
    //       "duration": 0.4,
    //       "mix": false,
    //       "selectors": []
    //     }
    //   },
    //   "connect": {
    //     "distance": 80,
    //     "links": {
    //       "opacity": 0.5
    //     },
    //     "radius": 60
    //   },
    //   "grab": {
    //     "distance": 400,
    //     "links": {
    //       "blink": false,
    //       "consent": false,
    //       "opacity": 1
    //     }
    //   },
    //   "push": {
    //     "default": true,
    //     "groups": [],
    //     "quantity": 4
    //   },
    //   "remove": {
    //     "quantity": 2
    //   },
    //   "repulse": {
    //     "distance": 200,
    //     "duration": 0.4,
    //     "factor": 100,
    //     "speed": 1,
    //     "maxSpeed": 50,
    //     "easing": "ease-out-quad",
    //     "divs": {
    //       "distance": 200,
    //       "duration": 0.4,
    //       "factor": 100,
    //       "speed": 1,
    //       "maxSpeed": 50,
    //       "easing": "ease-out-quad",
    //       "selectors": []
    //     }
    //   },
    //   "trail": {
    //     "delay": 1,
    //     "pauseOnStop": false,
    //     "quantity": 1
    //   },
    //   "light": {
    //     "area": {
    //       "gradient": {
    //         "start": {
    //           "value": "#ffffff"
    //         },
    //         "stop": {
    //           "value": "#000000"
    //         }
    //       },
    //       "radius": 1000
    //     },
    //     "shadow": {
    //       "color": {
    //         "value": "#000000"
    //       },
    //       "length": 2000
    //     }
    //   }
    // }
  },
  manualParticles: [],
  // "motion": {
  //   "disable": false,
  //   "reduce": {
  //     "factor": 4,
  //     "value": true
  //   }
  // },
  particles: {
    // "bounce": {
    //   "horizontal": {
    //     "random": {
    //       "enable": false,
    //       "minimumValue": 0.1
    //     },
    //     "value": 1
    //   },
    //   "vertical": {
    //     "random": {
    //       "enable": false,
    //       "minimumValue": 0.1
    //     },
    //     "value": 1
    //   }
    // },
    // "collisions": {
    //   "bounce": {
    //     "horizontal": {
    //       "random": {
    //         "enable": false,
    //         "minimumValue": 0.1
    //       },
    //       "value": 1
    //     },
    //     "vertical": {
    //       "random": {
    //         "enable": false,
    //         "minimumValue": 0.1
    //       },
    //       "value": 1
    //     }
    //   },
    //   "enable": false,
    //   "mode": "bounce",
    //   "overlap": {
    //     "enable": true,
    //     "retries": 0
    //   }
    // },
    // "color": {
    //   "value": "#ffffff",
    //   "animation": {
    //     "h": {
    //       "count": 0,
    //       "enable": false,
    //       "offset": 0,
    //       "speed": 1,
    //       "decay": 0,
    //       "sync": true
    //     },
    //     "s": {
    //       "count": 0,
    //       "enable": false,
    //       "offset": 0,
    //       "speed": 1,
    //       "decay": 0,
    //       "sync": true
    //     },
    //     "l": {
    //       "count": 0,
    //       "enable": false,
    //       "offset": 0,
    //       "speed": 1,
    //       "decay": 0,
    //       "sync": true
    //     }
    //   }
    // },
    // "destroy": {
    //   "mode": "none",
    //   "split": {
    //     "count": 1,
    //     "factor": {
    //       "random": {
    //         "enable": false,
    //         "minimumValue": 0
    //       },
    //       "value": 3
    //     },
    //     "rate": {
    //       "random": {
    //         "enable": false,
    //         "minimumValue": 0
    //       },
    //       "value": {
    //         "min": 4,
    //         "max": 9
    //       }
    //     },
    //     "sizeOffset": true
    //   }
    // },
    groups: {},
    move: {
      angle: {
        offset: 0,
        value: 90
      },
      attract: {
        distance: 200,
        enable: false,
        rotate: {
          x: 600,
          y: 1200
        }
      },
      center: {
        x: 50,
        y: 50,
        radius: 0
      },
      decay: 0,
      distance: {},
      direction: 'none',
      drift: 0,
      enable: true,
      gravity: {
        acceleration: 9.81,
        enable: false,
        inverse: false,
        maxSpeed: 50
      },
      path: {
        clamp: true,
        delay: {
          random: {
            enable: false,
            minimumValue: 0
          },
          value: 0
        },
        enable: false,
        options: {}
      },
      outModes: {
        default: 'out',
        bottom: 'out',
        left: 'out',
        right: 'out',
        top: 'out'
      },
      random: false,
      size: false,
      speed: 2,
      spin: {
        acceleration: 0,
        enable: false
      },
      straight: false,
      trail: {
        enable: false,
        length: 10,
        fillColor: {
          value: '#000000'
        }
      },
      vibrate: false,
      warp: false
    },
    number: {
      density: {
        enable: false,
        area: 800,
        factor: 1000
      },
      limit: 0,
      value: 50
    },
    opacity: {
      random: {
        enable: true,
        minimumValue: 0.1
      },
      value: {
        min: 0.1,
        max: 0.5
      },
      animation: {
        count: 0,
        enable: true,
        speed: 3,
        decay: 0,
        sync: false,
        destroy: 'none',
        startValue: 'random',
        minimumValue: 0.1
      }
    },
    reduceDuplicates: false,
    rotate: {
      random: {
        enable: false,
        minimumValue: 0
      },
      value: 0,
      animation: {
        enable: false,
        speed: 0,
        decay: 0,
        sync: false
      },
      direction: 'clockwise',
      path: false
    },
    shadow: {
      blur: 0,
      color: {
        value: '#000'
      },
      enable: false,
      offset: {
        x: 0,
        y: 0
      }
    },
    shape: {
      options: {},
      type: 'circle'
    },
    size: {
      random: {
        enable: true,
        minimumValue: 1
      },
      value: {
        min: 0.1,
        max: 10
      },
      animation: {
        count: 0,
        enable: true,
        speed: 20,
        decay: 0,
        sync: false,
        destroy: 'none',
        startValue: 'random',
        minimumValue: 0.1
      }
    },
    stroke: {
      width: 0
    },
    zIndex: {
      random: {
        enable: false,
        minimumValue: 0
      },
      value: 0,
      opacityRate: 1,
      sizeRate: 1,
      velocityRate: 1
    },
    life: {
      count: 0,
      delay: {
        random: {
          enable: false,
          minimumValue: 0
        },
        value: 0,
        sync: false
      },
      duration: {
        random: {
          enable: false,
          minimumValue: 0.0001
        },
        value: 0,
        sync: false
      }
    },
    roll: {
      darken: {
        enable: false,
        value: 0
      },
      enable: false,
      enlighten: {
        enable: false,
        value: 0
      },
      mode: 'vertical',
      speed: 25
    },
    tilt: {
      random: {
        enable: false,
        minimumValue: 0
      },
      value: 0,
      animation: {
        enable: false,
        speed: 0,
        decay: 0,
        sync: false
      },
      direction: 'clockwise',
      enable: false
    },
    twinkle: {
      lines: {
        enable: false,
        frequency: 0.05,
        opacity: 1
      },
      particles: {
        enable: false,
        frequency: 0.05,
        opacity: 1
      }
    },
    wobble: {
      distance: 5,
      enable: false,
      speed: {
        angle: 50,
        move: 10
      }
    },

    links: {
      blink: false,
      color: {
        value: '#ffffff'
      },
      consent: false,
      distance: 180,
      enable: true,
      frequency: 1,
      opacity: 0.4,
      shadow: {
        blur: 5,
        color: {
          value: '#000'
        },
        enable: false
      },
      triangles: {
        enable: false,
        frequency: 1
      },
      width: 1,
      warp: false
    }
  },
  pauseOnBlur: true,
  pauseOnOutsideViewport: true,
  responsive: [],
  style: {},
  themes: [],
  zLayers: 100
}

export const roleBaseData = role => {
  let data = [
    { role: 'safetyOfficer', department_id: 26 },
    { role: 'safety', department_id: 26 },
    { role: 'security', department_id: 26 },
    { role: 'utility', department_id: 26 },

    { role: 'hr', department_id: 21 },
    { role: 'hrHead', department_id: 21 },

    { role: 'it', department_id: 11 },
    { role: 'itHead', department_id: 11 },

    { role: 'accounting', department_id: 24 },
    { role: 'accountingHead', department_id: 24 }
  ]

  let filter = data.filter(item => item.role === role)

  return filter?.[0]?.department_id
}

export const renameFile = file => {
  const newFileName = `${Date.now()}_${file.name}`
  const renamedFile = new File([file], newFileName, { type: file.type })
  return renamedFile
}

export const convertToBase64 = (file, setFileBase64) => {
  const reader = new FileReader()

  reader.onloadend = () => {
    const base64String = reader.result.replace('data:', '').replace(/^.+,/, '')
    setFileBase64(base64String)
  }

  reader.readAsDataURL(file)
}

export const validateFileType = file => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
  return allowedTypes.includes(file.type)
}

export const isPDF = file => {
  const extension = file?.split('.').pop().toLowerCase()
  if (['pdf'].includes(extension)) {
    return true
  }

  return false
}

export const formatDate = dateStr => {
  const date = new Date(dateStr)

  // Extract date components
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // Months are 0-based
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')

  // Format into "YYYY-MM-DD HH:MM:SS"
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export const combineDateTime = (dateStr, timeStr) => {
  // Parse the date and time strings into Date objects
  const date = new Date(dateStr)
  const time = new Date(timeStr)

  // Extract date components from the date string
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // Months are 0-based
  const day = date.getDate().toString().padStart(2, '0')

  // Extract time components from the time string
  const hours = time.getHours().toString().padStart(2, '0')
  const minutes = time.getMinutes().toString().padStart(2, '0')
  const seconds = time.getSeconds().toString().padStart(2, '0')

  // Combine date and time into a single string
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export const handleDateFormat = data => {
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

export const handleDateOnlyFormat = data => {
  if (!data) return ''

  const date = new Date(data)

  const formattedDate = date.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  })

  return formattedDate
}

export const handleTotalTime = (from, to) => {
  const startDate = new Date(from)
  const endDate = new Date(to)

  const differenceInMs = endDate - startDate

  const totalMinutes = Math.floor(differenceInMs / (1000 * 60))

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  const formattedResult = `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`
  return formattedResult
}

export const handleTimeOnly = newDate => {
  if (newDate == null) {
    return 'N/A'
  }

  let dateFormat = new Date(newDate)

  let hours = dateFormat.getHours()
  const minutes = dateFormat.getMinutes()

  // Convert hours to 12-hour format
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'

  // Format minutes to be always two digits
  const minutesStr = minutes < 10 ? '0' + minutes : minutes

  // Combine hours, minutes, and AM/PM
  const formattedTime = `${hours}:${minutesStr} ${ampm}`

  return formattedTime
}
