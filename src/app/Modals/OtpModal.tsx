import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React, { useEffect, useState } from 'react'
import OTPInput from '../hooks/OTPInput'
import useModalHook from '../hooks/useModalHook';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { ApiUrl } from '@/api/api_url';
import { GToaster } from '../helper/g_toaster';

interface ComponentProps {
  open: boolean;
  handleClose: () => void;
  setEmailVerified: (e: boolean) => void;
  byVerify: string;
  setPhoneVerified: (e: boolean) => void;
  countryCode: string;
  phone: string;
  email: string
  otp: any
}
const OtpModal = ({ open, handleClose, setEmailVerified, byVerify, setPhoneVerified, countryCode, phone, email, otp }: ComponentProps) => {
  const [OTPValue, setOTPValue] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const toast = new GToaster();
  const sendEmailOtp = async () => {
    try {
      const response = await axiosInterceptorInstance.post(ApiUrl.EMAIL_VERIFY, {
        email,
        otp: +OTPValue,
      })

      return response

    } catch (error) {
      return error
    }
  }

  const handleVerify = () => {
    if (byVerify === "phone") {

      if (OTPValue.length === 6) {
        setLoading(true)
        otp.confirm(OTPValue).then(async () => {
          setLoading(false)
          setPhoneVerified(true);
          handleClose()
        }).catch((err: any) => {
          setLoading(false)
          toast.error({ title: "Something went wrong." })
          console.log(err)
        })
        // setPhoneVerified(true);
        // handleClose()
      }
    }

    if (byVerify === "email") {
      if (OTPValue.length === 6) {
        sendEmailOtp().then((result: any) => {
          if (result.status === 200) {
            setEmailVerified(true);
            handleClose()
          } else {
            toast.error({ title: result?.response?.data?.message })
            handleClose()
          }
        })

      }
    }

  }
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Please Verify Your {byVerify === "email" ? <strong>Email</strong> : <strong>Phone Number</strong>}.
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          We send code to {byVerify === "email" ? <strong>{email}</strong> : <strong>{phone}</strong>}
        </DialogContentText>
        <OTPInput
          autoFocus
          isNumberInput
          length={6}
          className="otpContainer"
          inputClassName="otpInput"
          onChangeOTP={(otp) => setOTPValue(otp)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleVerify} autoFocus
          startIcon={
            loading ? (
              <CircularProgress color="inherit" size="24px" />
            ) : (
              <></>
            )
          } >
          Verify Otp
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default OtpModal