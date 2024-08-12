import { Box, Container } from '@mui/material'
import React from 'react'
import styles from '../page.module.css'
import  StoreDetailStepper  from './StoreDetailStepper'
import backgroundImage from "../../../public/looplogin-01-01.svg";
const styling = {
  backgroundImage: { xs: `url(${backgroundImage.src})` },
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right",
  backgroundSize: "cover",
  backgroundColor: "white",
};
const page = () => {
  return (
    <Box component="main" className={styles.main} sx={styling}>
      <Container maxWidth="sm">
        <StoreDetailStepper />
      </Container>
    </Box>
  )
}

export default page