import { Chip } from '@mui/material'
import React, { useEffect } from 'react'

const StatusUI = ({ name, is_urgent }) => {
  useEffect(() => {}, [])

  const getUrgent = is_urgent => {
    return is_urgent ? 'filled' : 'outlined'
  }

  const getColor = name => {
    switch (name) {
      case 'Pending':
        return 'warning'
      case 'Approved':
        return 'success'
      case 'Rejected':
        return 'default'
      default:
        return 'default'
    }
  }

  return (
    <Chip label={name} variant={getUrgent(is_urgent)} color={getColor(name)} />
  )
}

export default StatusUI
