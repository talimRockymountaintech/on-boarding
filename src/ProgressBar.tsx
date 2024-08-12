"use client"
import { AppProgressBar } from 'next-nprogress-bar'
import React from 'react'

const ProgressBar = () => {
  return (
    <AppProgressBar
    height="4px"
    options={{ showSpinner: false }}
/>
  )
}

export default ProgressBar