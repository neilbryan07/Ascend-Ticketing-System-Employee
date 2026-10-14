import React from 'react'
import { Navigate } from 'react-router-dom'

/* AUTH Page */
import Login from '../pages/Auth/Login'

/* Dashboard */
import Ticket from '../pages/Ticket/Ticket'
import UtilTicket from '../pages/Ticket/UtilTicket'
import HrTicket from '../pages/Ticket/HrTicket'
import AcctTicket from '../pages/Ticket/AcctTicket'
import Timesheets from '../pages/Timesheets/Timesheets'

/* OverTime */

import { OverTime } from '../pages/OverTime/OverTime'

/* Leave Request */
import LeaveRequest from '../pages/LeaveRequest/Leave'

/* Optional */

import ErrorPage from '../pages/ErrorPage/ErrorPage'

import { pageRoutes } from '../contants'

import Container from '../component/Container/container'
import Splash from '../pages/Auth/Splash'

const routes = [
  {
    path: 'app',
    element: <Container />,
    children: [
      { path: pageRoutes.TICKET, element: <Ticket /> },
      { path: pageRoutes.UTILTICKET, element: <UtilTicket /> },
      { path: pageRoutes.HRTICKET, element: <HrTicket /> },
      { path: pageRoutes.ACCTTICKET, element: <AcctTicket /> },
      { path: pageRoutes.TIMESHEETS, element: <Timesheets /> },
      { path: pageRoutes.LEAVEREQUEST, element: <LeaveRequest /> },
      { path: pageRoutes.OVERTIME, element: <OverTime /> }
    ]
  },
  {
    path: '/',
    children: [
      { path: pageRoutes.SPLASH, element: <Splash /> },
      { path: pageRoutes.LOGIN, element: <Login /> },
      { path: '*', element: <Navigate to='/404' /> },
      { path: '404', element: <ErrorPage /> }
    ]
  }
]

export default routes
