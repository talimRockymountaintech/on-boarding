
"use client"
import { Autocomplete, Box, Button, Card, CardContent, CircularProgress, Container, createFilterOptions, Divider, FormControl, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, TextField, Typography } from '@mui/material'
import { dialCodes as getDialCodes } from "../../../src/dialCode";
import { Controller, useForm } from 'react-hook-form';
import { SInputs } from '@/globalTypescript';
import { ApiUrl, ValidationMessages } from '@/api/api_url';
import { useEffect, useState } from 'react';
import { useRouter } from 'next-nprogress-bar';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import useModalHook from '../hooks/useModalHook';
import OtpModal from '../Modals/OtpModal';
import firebase from "firebase";
import { auth } from '../helper/firebase';
import VerifiedIcon from '@mui/icons-material/Verified';
import { GToaster } from '../helper/g_toaster';
import { isValidEmail, isValidPhoneNumber } from '../utility/commonFunctions';
import { useAuth } from '../context/AuthContext';
const defaultCodeValue = {
    _id: "64f59f9412c0eca81c112888",
    name: "India",
    dial_code: "+91",
    code: "IN",
    __v: 0,
    is_active: true,
    created_at: "2023-09-04 14:49:14",
    updated_at: "2023-09-04 14:49:14"
}
export default function HomePage() {
    const [showPassword, setShowPassword] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const [otp, setotp] = useState<any>('');
    const [phoneVerified, setPhoneVerified] = useState(false);
    const [open, handleOpen, handleClose] = useModalHook(false);
    const [timeZoneList, setTimeZoneList] = useState([])
    const [byVerify, setByVerify] = useState("")
    const [loading, setLoading] = useState(false);
    const route = useRouter();
    const toast = new GToaster();
    const { login } = useAuth();
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        control,
        watch,
    } = useForm<SInputs>({
        defaultValues: {
            name: "",
            password: "",
            email: "",
            phone: 0,
            time_zone: "",
          },
    });
    const getTimeZone = async () => {
        try {
            const response = await axiosInterceptorInstance.get(ApiUrl.GET_TIME_ZONE);
            if (response?.data?.status === "success") {
                setTimeZoneList(response?.data.data)
            }
        } catch (error) {
            toast.error({ title: "Something went wrong!" });
        }
    }
    const sendEmailOtp = async () => {
        try {
            const response = await axiosInterceptorInstance.post(ApiUrl.SEND_EMAIL_OTP, {
                email: getValues("email")
            })
            return response

        } catch (error) {
            return error
        }
    }
    const onSubmit = async (data: SInputs) => {
        setLoading(true)
        try {
            const response = await axiosInterceptorInstance.post(ApiUrl.STORE_SUPER_ADMIN_ADD, {
                ...data,
                is_verified: true,
                is_active: true,
            });
            if(response.status === 200){
                  const superAdminId = response?.data?.data._id
                  localStorage.setItem("on_super_admin_id", superAdminId);
                  toast.success({title : response?.data?.message})
                  login();
                  route.push('/store-details');
            }
        } catch (error:any) {
            toast.error({title: error?.response?.data?.message})
        }finally{
            setLoading(false)
        }
    }

    // Phone verifed
    const handlePhoneVerifed = () => {
    try {
            const appVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', { "size": "invisible" });
            const phoneNumber = getValues("country_code") + getValues("phone");
            auth.signInWithPhoneNumber(phoneNumber, appVerifier)
                .then((confirmationResult: any) => {
                    setByVerify("phone")
                    handleOpen();
                    setotp(confirmationResult);
                }).catch((error: any) => {
                    toast.error({ title: error.message });
                });
        } catch (error) {
            console.log(error);
        }
     

    }


    // Email verified 
    const handleEmailVerifed = () => {
        sendEmailOtp().then((result: any) => {
            if (result.status === 200) {
                setByVerify("email")
                handleOpen();
            } else {
                toast.error({ title: "Something went wrong." })
            }
        })

    }

    const filterOptions = createFilterOptions({
        // @ts-ignore
        stringify: ({ name, dial_code }) => `${name} ${dial_code}`,
    });



    useEffect(() => {
        getTimeZone()
    }, []);



    return (
        <>
            <Card  >
                <CardContent>
                    <Typography variant="h4" component="div">
                        Store Super Admin
                    </Typography>
                    <Box>
                        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                            <Controller
                                name='name'
                                control={control}
                                render={({ field: { value } }) => (
                                    <TextField
                                        value={value}
                                        id="outlined-basic"
                                        label="Name"
                                        variant="outlined"
                                        sx={{ mt: "24px" }}
                                        error={!!errors.name}
                                        helperText={!!errors?.name && errors?.name.message}
                                        fullWidth
                                        size="small"
                                        {...register("name", {
                                            required: ValidationMessages.FIELD_REQUIRED,
                                            validate: {
                                                maxLength: (v) =>
                                                    v.length > 2 ||
                                                    "Your name should contain Atleast 3 Characters",
                                            },
                                        })}
                                    />
                                )}
                            />

                            <FormControl
                                sx={{ mt: "17px" }}
                                variant="outlined"
                                fullWidth
                                size="small"
                            >
                                <InputLabel
                                    htmlFor="outlined-adornment-password"
                                    error={!!errors?.password}
                                >
                                    Password
                                </InputLabel>
                                <Controller
                                    name='password'
                                    control={control}
                                    render={({ field: { value } }) => (
                                        <OutlinedInput
                                            value={value}
                                            id="outlined-adornment-password"
                                            type={showPassword ? "text" : "password"}
                                            {...register("password", {
                                                required: "This Field is required",
                                                validate: {
                                                    maxLength: (v) =>
                                                        v.length > 2 ||
                                                        "Your password should contain Atleast 3 Characters",
                                                },
                                            })}
                                            error={!!errors?.password}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            label="Password"
                                        />
                                    )}
                                />

                                {!!errors?.password && (
                                    <FormHelperText error id="password-error">
                                        {errors?.password?.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                            <Controller
                                name='email'
                                control={control}
                                render={({ field: { value } }) => (
                                    <TextField
                                        value={value}
                                        id="outlined-basic"
                                        label="E-mail"
                                        variant="outlined"
                                        sx={{ mt: "17px" }}
                                        error={!!errors.email}
                                        helperText={!!errors?.email && errors?.email.message}
                                        fullWidth
                                        size="small"
                                        {...register("email", {
                                            required: ValidationMessages.FIELD_REQUIRED,
                                            validate: {
                                                maxLength: (v) =>
                                                    v.length <= 50 ||
                                                    "The email should have at most 50 characters",
                                                matchPattern: (v) =>
                                                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                                                    "Email address must be a valid address",
                                            },
                                        })}
                                        InputProps={{
                                            endAdornment: emailVerified ? <VerifiedIcon color='success' /> : <Button sx={{ minWidth: "100px" }} onClick={handleEmailVerifed}
                                                disabled={!isValidEmail(watch("email"))}
                                            >Send OTP</Button>
                                        }}
                                    />
                                )}
                            />

                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={3.5}>
                                    <Controller
                                        name='country_code'
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <Autocomplete
                                                value={value}
                                                onChange={onChange}
                                                defaultValue={null}
                                                size="small"
                                                sx={{ mt: "17px" }}
                                                filterOptions={filterOptions}
                                                getOptionLabel={(getDialCodes: any) =>
                                                    getDialCodes.dial_code
                                                }

                                                autoComplete={false}
                                                options={getDialCodes}
                                                noOptionsText={"COUNTRY CODE NOT FOUND"}
                                                renderOption={(props, getDialCodes: any) => (
                                                    <MenuItem
                                                        {...props}
                                                        key={getDialCodes._id}
                                                        value={getDialCodes.dial_code}
                                                    >
                                                        {getDialCodes.name}
                                                    </MenuItem>
                                                )}
                                                renderInput={(params) => {
                                                    const inputProps = params.inputProps;
                                                    inputProps.autoComplete = "new-password";
                                                    return (
                                                        <Controller
                                                            name='country_code'
                                                            control={control}
                                                            render={({ field: { value } }) => (
                                                                <TextField
                                                                    value={value}
                                                                    {...register("country_code", {
                                                                        required: ValidationMessages.FIELD_REQUIRED,
                                                                    })}
                                                                    {...params}
                                                                    label="Country code"
                                                                    error={!!errors.country_code}
                                                                    helperText={
                                                                        !!errors?.country_code && errors?.country_code.message
                                                                    }
                                                                />
                                                            )}
                                                        />

                                                    );
                                                }}
                                            />
                                        )}
                                    />




                                </Grid>
                                <Grid item xs={12} sm={8.5}>
                                    <Controller
                                        name='phone'
                                        control={control}
                                        render={({ field: { value } }) => (
                                            <TextField
                                                value={value}
                                                id="outlined-basic"
                                                label="Phone Number"
                                                variant="outlined"
                                                sx={{ mt: "17px" }}
                                                error={!!errors.phone}
                                                helperText={
                                                    !!errors?.phone && errors?.phone.message
                                                }
                                                fullWidth
                                                size="small"
                                                {...register("phone", {
                                                    required: ValidationMessages.FIELD_REQUIRED,
                                                    pattern: {
                                                        value: /^[0-9+-]+$/,
                                                        message: "Must be a number",
                                                    },
                                                    minLength: { value: 6, message: "Minimum 6 characters" },
                                                    maxLength: {
                                                        value: 12,
                                                        message: "Maximum 12 characters",
                                                    },
                                                })}
                                                InputProps={{
                                                    endAdornment: phoneVerified ? <VerifiedIcon color='success' /> :
                                                        <Button sx={{ minWidth: "100px" }} onClick={handlePhoneVerifed}
                                                            disabled={!isValidPhoneNumber(watch("phone")?.toString())}
                                                        >Send OTP</Button>
                                                }}
                                            />
                                        )}
                                    />

                                </Grid>
                            </Grid>
                            <FormControl fullWidth size='small' sx={{ mt: "17px" }} >
                                <InputLabel id="demo-simple-select-label">Time Zone</InputLabel>
                                <Controller
                                    name='time_zone'
                                    control={control}
                                    render={({ field: { value } }) => (
                                        <Select
                                            value={value}
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            defaultValue=""
                                            label="Time Zone"
                                            {...register("time_zone", { required: ValidationMessages.FIELD_REQUIRED })}
                                            error={!!errors?.time_zone}
                                        >{
                                                timeZoneList.length > 0 && timeZoneList?.map((zone: any) => (
                                                    <MenuItem key={zone._id} value={zone._id} >{zone.time_zone}</MenuItem>
                                                ))
                                            }

                                        </Select>
                                    )}
                                />
                                {!!errors?.time_zone && (
                                    <FormHelperText error id="timeZone-error">
                                        {errors?.time_zone?.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                            <Button
                                type='submit'
                                variant="contained"
                                fullWidth
                                disabled={!emailVerified || !phoneVerified}
                                sx={{ mt: "24px" }}
                                startIcon={
                                    loading ? (
                                        <CircularProgress color="inherit" size="24px" />
                                    ) : (
                                        <></>
                                    )
                                }
                            >
                                Submit
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
            <Box textAlign="center"><div id="recaptcha-container" style={{ margin: "1rem 0" }}></div></Box>
            <OtpModal
                open={open}
                handleClose={handleClose}
                setEmailVerified={setEmailVerified}
                byVerify={byVerify}
                setPhoneVerified={setPhoneVerified}
                countryCode={getValues("country_code")}
                phone={getValues("phone")}
                email={getValues("email")}
                otp={otp}
            />

        </>
    )
}
