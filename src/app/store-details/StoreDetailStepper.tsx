"use client"
import React, { ReactNode, useEffect, useState } from 'react'
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { dialCodes as getDialCodes } from "../../../src/dialCode";
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';
import { Autocomplete, Box, Button, Card, CardContent, CircularProgress, createFilterOptions, FormControl, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, TextField } from '@mui/material';
import GooglePlacesAutocomplete, { geocodeByAddress, geocodeByPlaceId, getLatLng } from 'react-google-places-autocomplete';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { ApiUrl, ValidationMessages } from '@/api/api_url';
import { Controller, useForm } from 'react-hook-form';
import { AInputs, ICurrency, LInputs, SSInputs } from '@/globalTypescript';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import axios from 'axios';
import withAuth from '../hoc/withAuth';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { GToaster } from '../helper/g_toaster';
const StyledBox = styled("div")(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    marginBottom: 0,

    '& div:first-child': {
        width: '60%',
    },

    [theme.breakpoints.down('sm')]: {
        '& .MuiButtonBase-root': {
            justifyContent: 'flex-start',
        },

        '& div:first-child': {
            width: '100%'
        },
    },

    [theme.breakpoints.up('sm')]: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing(2),
        justifyContent: 'flex-start',
        '& div:first-child': {
            width: '100%'
        },
    },

    [theme.breakpoints.up('md')]: {
        flexDirection: 'column',
        alignItems: 'initial',
        marginBottom: 0,
        '& div:first-child': {
            width: '100%'
        },
    }
}));

const mapDefaultValues = {
    steetAddress: '',
    zipCode: "",
    longitude: 0,
    latitude: 0,
    landmark: '',
}
const StoreDetailStepper: React.FC = () => {
    const superAdminId = localStorage.getItem("on_super_admin_id");
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searchAddress, setSearchAddress] = useState<any>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [timeZoneList, setTimeZoneList] = useState([]);
    const [currencyList, setCurrencyList] = useState([]);
    const [currencyName, setCurrencyName] = useState("CAD")
    const toast = new GToaster();
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        getValues: storeGetValues
    } = useForm<SSInputs>();

    const {
        register: locationRegister,
        handleSubmit: locationHandleSubmit,
        formState: { errors: locationErrors },
        control: locationControl,
        setValue,
        getValues: locactionGetValues,
        watch
    } = useForm<LInputs>();
    const {
        register: adminRegister,
        handleSubmit: adminHandleSubmit,
        formState: { errors: adminErrors },
        control: adminControl,
        watch: adminWatch,
    } = useForm<AInputs>();
    // fetch time zone
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
    // fetch currency
    const getCurrency = async () => {
        try {
            const response = await axiosInterceptorInstance.get(ApiUrl.GET_CURRENCY);
            if (response?.data?.status === "success") {
                setCurrencyList(response?.data.data)
            }
        } catch (error) {
            toast.error({ title: "Something went wrong!" });
        }
    }

    const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
        [`&.${stepConnectorClasses.alternativeLabel}`]: {
            top: 22,
        },
        [`&.${stepConnectorClasses.active}`]: {
            [`& .${stepConnectorClasses.line}`]: {
                backgroundImage:
                    'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
            },
        },
        [`&.${stepConnectorClasses.completed}`]: {
            [`& .${stepConnectorClasses.line}`]: {
                backgroundImage:
                    'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
            },
        },
        [`& .${stepConnectorClasses.line}`]: {
            height: 3,
            border: 0,
            backgroundColor:
                theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
            borderRadius: 1,
        },
    }));

    const ColorlibStepIconRoot = styled('div')<{
        ownerState: { completed?: boolean; active?: boolean };
    }>(({ theme, ownerState }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
        zIndex: 1,
        color: '#fff',
        width: 50,
        height: 50,
        display: 'flex',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        ...(ownerState.active && {
            backgroundImage:
                'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
            boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
        }),
        ...(ownerState.completed && {
            backgroundImage:
                'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
        }),
    }));

    function ColorlibStepIcon(props: StepIconProps) {
        const { active, completed, className } = props;

        const icons: { [index: string]: React.ReactElement } = {
            1: <StorefrontIcon />,
            2: <LocationOnIcon />,
            3: <SupervisorAccountIcon />,
            4: <CheckCircleOutlineIcon />
        };

        return (
            <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
                {icons[String(props.icon)]}
            </ColorlibStepIconRoot>
        );
    }

    const steps = ['Store settings', 'Location setting', 'Store admin', 'Completed'];
    const onStoreSubmit = (data: SSInputs) => {
        setActiveStep(1)
    }
    const onLocationSubmit = (data: LInputs) => {
        setActiveStep(2)
    }
    const onAdminSubmit = async (data: AInputs) => {
        setLoading(true)
        const { storeName, storeEmail, countryCode, storePhone, time_zone, storeCurrency, currencyAlignment } = storeGetValues();
        const { steetAddress, longitude, latitude, zipCode, landmark } = locactionGetValues();
        const { name, email, password, countryCode: adminCountryCode, phone, pin } = data;
        const payload = {
            general_setting: {
                store_name: storeName,
                store_email: storeEmail,
                store_country_code: countryCode,
                store_phone: storePhone,
                time_zone,
                store_currency: currencyName,
                currency_symbol: storeCurrency,
                currency_symbol_alignment: currencyAlignment,
            },
            location_setting: {
                address: steetAddress,
                zip_code: zipCode,
                land_mark: landmark,
                latitude,
                longitude,
            },
            end_day_setting: {
                start_by_manager: true,
                end_by_manager: true
            },
            store: {
                plan: "6594e24fe872c9342cb64cd2",
                store_is_active: true
            },
            store_admin: {
                name: name,
                email,
                password,
                is_active: true,
                is_verified: true,
                pin,
                country_code: adminCountryCode,
                phone
            }

        }
        try {
            const response = await axiosInterceptorInstance.post(ApiUrl.STORE_ADD + superAdminId, payload);
            if (response.status === 200) {
                localStorage.removeItem("on_super_admin_id");
                toast.success({ title: response?.data?.message })
                setActiveStep(3)
            }
        } catch (error: any) {
            toast.error({ title: error?.response?.data?.message })
        }finally{
            setLoading(false)
        }

    }
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleAddressSelect = async (e: any) => {
        let copiedObj: LInputs = { ...mapDefaultValues };
        geocodeByPlaceId(e.value.place_id).then((succ: any) => {
            getLatLng(succ[0]).then(({ lat, lng }) => {
                let addressLength = succ[0]?.address_components.length
                let postal_code = succ[0]?.address_components[addressLength - 1]?.short_name
                let address = succ[0].formatted_address
                let l1 = lat
                let l2 = lng
                const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${l1}&lon=${l2}`
                axios.get(url).then((response) => {
                    if (response.status === 200) {
                        copiedObj.steetAddress = address
                        copiedObj.latitude = l1
                        copiedObj.longitude = l2
                        copiedObj.zipCode = postal_code
                        setValue('steetAddress', address);
                        setValue('latitude', l1);
                        setValue('longitude', l2);
                        setValue('zipCode', postal_code);
                    }
                })
            })
        })
    }

    const handlePrev = () => {
        setActiveStep((prev) => prev - 1)
    }
    const filterOptions = createFilterOptions({
        // @ts-ignore
        stringify: ({ name, dial_code }) => `${name} ${dial_code}`,
    });
    // fetch Time Zone
    useEffect(() => {
        getCurrency()
        getTimeZone()
    }, []);

    return (
        <Card >
            <CardContent>
                <Stack sx={{ width: '100%' }} spacing={4}>
                    <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Stack>
                {activeStep === 0 &&
                    <Box>
                        <Box component="form" onSubmit={handleSubmit(onStoreSubmit)}>
                            <Controller
                                name='storeName'
                                control={control}
                                render={({ field: { value } }) => (
                                    <TextField
                                        value={value}
                                        id="outlined-basic"
                                        label="Store Name"
                                        variant="outlined"
                                        sx={{ mt: "24px" }}
                                        error={!!errors.storeName}
                                        helperText={!!errors?.storeName && errors?.storeName.message}
                                        fullWidth
                                        size="small"
                                        {...register("storeName", {
                                            required: ValidationMessages.FIELD_REQUIRED,
                                            validate: {
                                                maxLength: (v) =>
                                                    v.length > 2 ||
                                                    "Your Store Name should contain Atleast 3 Characters",
                                            },
                                        })}
                                    />
                                )}
                            />

                            <Controller
                                name='storeEmail'
                                control={control}
                                render={({ field: { value } }) => (
                                    <TextField
                                        value={value}
                                        id="outlined-basic"
                                        label="E-mail"
                                        variant="outlined"
                                        sx={{ mt: "17px" }}
                                        error={!!errors.storeEmail}
                                        helperText={!!errors?.storeEmail && errors?.storeEmail.message}
                                        fullWidth
                                        size="small"
                                        {...register("storeEmail", {
                                            required: ValidationMessages.FIELD_REQUIRED,
                                            validate: {
                                                maxLength: (v) =>
                                                    v.length <= 50 ||
                                                    "The storeEmail should have at most 50 characters",
                                                matchPattern: (v) =>
                                                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                                                    "Email address must be a valid address",
                                            },
                                        })}
                                    />
                                )}
                            />


                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={3.5}>
                                    <Controller
                                        name='countryCode'
                                        control={control}
                                        render={({ field: { value } }) => (
                                            <Autocomplete
                                                size="small"
                                                sx={{ mt: "17px" }}
                                                defaultValue={null}
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
                                                        <TextField
                                                            value={value}
                                                            {...register("countryCode", {
                                                                required: ValidationMessages.FIELD_REQUIRED,
                                                            })}
                                                            {...params}
                                                            label="Country code"
                                                            error={!!errors.countryCode}
                                                            helperText={
                                                                !!errors?.countryCode && errors?.countryCode.message
                                                            }
                                                        />


                                                    );
                                                }}
                                            />
                                        )}
                                    />



                                </Grid>
                                <Grid item xs={12} sm={8.5}>
                                    <Controller
                                        name='storePhone'
                                        control={control}
                                        render={({ field: { value } }) => (
                                            <TextField
                                                value={value}
                                                id="outlined-basic"
                                                label="Phone Number"
                                                variant="outlined"
                                                sx={{ mt: "17px" }}
                                                error={!!errors.storePhone}
                                                helperText={
                                                    !!errors?.storePhone && errors?.storePhone.message
                                                }
                                                fullWidth
                                                size="small"
                                                {...register("storePhone", {
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
                                            defaultValue=''
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
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
                            <Grid container spacing={1}>
                                <Grid item xs={6} sm={6}>
                                    <FormControl fullWidth size='small' sx={{ mt: "17px" }} >
                                        <InputLabel id="demo-simple-select-label">Store Currency</InputLabel>
                                        <Controller
                                            name='storeCurrency'
                                            control={control}
                                            render={({ field: { value } }) => (
                                                <Select
                                                    value={value}
                                                    defaultValue=''
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    label="Store Currency"
                                                    {...register("storeCurrency", { required: ValidationMessages.FIELD_REQUIRED })}
                                                    error={!!errors?.storeCurrency}
                                                >
                                                    {currencyList.length > 0 && currencyList.map((currency: ICurrency) => {

                                                        return <MenuItem value={currency?.symbol} key={currency._id} onClick={() => setCurrencyName(currency?.name)}>{currency?.symbol}</MenuItem>
                                                    })}

                                                </Select>
                                            )}
                                        />


                                        {!!errors?.storeCurrency && (
                                            <FormHelperText error id="storeCurrency-error">
                                                {errors?.storeCurrency?.message}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6} sm={6}>
                                    <FormControl fullWidth size='small' sx={{ mt: "17px" }} >
                                        <InputLabel id="demo-simple-select-label">Currency Alignment</InputLabel>
                                        <Controller
                                            name='currencyAlignment'
                                            control={control}
                                            render={({ field: { value } }) => (
                                                <Select
                                                    value={value}
                                                    defaultValue=''
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    label="Currency Alignment"
                                                    {...register("currencyAlignment", { required: ValidationMessages.FIELD_REQUIRED })}
                                                    error={!!errors?.currencyAlignment}
                                                >
                                                    <MenuItem value="left">Left</MenuItem>
                                                    <MenuItem value="right">Right</MenuItem>
                                                </Select>
                                            )}
                                        />

                                        {!!errors?.currencyAlignment && (
                                            <FormHelperText error id="storeCurrency-error">
                                                {errors?.currencyAlignment?.message}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Box display="flex" justifyContent="space-between">
                                <Button
                                    disabled
                                    variant="contained"
                                    onClick={handlePrev}
                                    sx={{ mt: "24px" }}
                                    startIcon={<ArrowBackIcon />}
                                >
                                    PREV
                                </Button>
                                <Button
                                    type='submit'
                                    variant="contained"

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
                    </Box>
                }
                {activeStep === 1 &&
                    <Box mt={4}>
                        <StyledBox className='search_address' >
                            <GooglePlacesAutocomplete
                                apiKey={'AIzaSyBLVIcbGHiO0lFwfgZgKBx9UlSz_yrl_IU'}
                                selectProps={{
                                    onInputChange: (e) => { setSearchAddress(e) },
                                    value: searchAddress,
                                    onChange: handleAddressSelect,
                                    placeholder: 'Pick your location',
                                    styles: {
                                        input: provided => ({
                                            ...provided,
                                            color: 'black',

                                            fontSize: '15px',
                                            height: '31px',
                                            borderRadius: '6px',
                                            focus: '2px solid #F2EEED'
                                        }),
                                        option: provided => ({
                                            ...provided,
                                            color: 'black',
                                            fontSize: '15px'
                                        }),
                                        singleValue: provided => ({
                                            ...provided,
                                            color: 'black'
                                        })
                                    }
                                }}
                                onLoadFailed={error => console.error('Could not inject Google script', error)}
                            />
                        </StyledBox>
                        <Box component="form" onSubmit={locationHandleSubmit(onLocationSubmit)}>
                            <Controller
                                name='steetAddress'
                                control={locationControl}
                                render={({ field: { value } }) => (
                                    <TextField
                                        value={value}
                                        id="outlined-basic"
                                        label="Steet Address"
                                        variant="outlined"
                                        sx={{ mt: "24px" }}
                                        InputLabelProps={{ shrink: !!watch("steetAddress") }}
                                        error={!!locationErrors.steetAddress}
                                        helperText={!!locationErrors?.steetAddress && locationErrors?.steetAddress.message}
                                        fullWidth
                                        size="small"
                                        {...locationRegister("steetAddress", {
                                            required: ValidationMessages.FIELD_REQUIRED,
                                            validate: {
                                                maxLength: (v) =>
                                                    v.length > 2 ||
                                                    "Your Steet Address should contain Atleast 3 Characters",
                                            },
                                        })}
                                    />
                                )}
                            />


                            <Grid container spacing={1}>
                                <Grid item xs={6} sm={6}>
                                    <Controller
                                        name='longitude'
                                        control={locationControl}
                                        render={({ field: { value } }) => (
                                            <TextField
                                                value={value}
                                                id="outlined-basic"
                                                label="Longitude"
                                                variant="outlined"
                                                disabled
                                                sx={{ mt: "24px" }}
                                                InputLabelProps={{ shrink: !!watch("longitude") }}
                                                error={!!locationErrors.longitude}
                                                helperText={!!locationErrors?.longitude && locationErrors?.longitude.message}
                                                fullWidth
                                                size="small"
                                                {...locationRegister("longitude", {
                                                    required: ValidationMessages.FIELD_REQUIRED,
                                                    validate: {
                                                        maxLength: (v) =>
                                                            v > 2 ||
                                                            "Your Longitude should contain Atleast 3 Characters",
                                                    },
                                                })}
                                            />
                                        )}
                                    />

                                </Grid>
                                <Grid item xs={6} sm={6}>
                                    <Controller
                                        name='latitude'
                                        control={locationControl}
                                        render={({ field: { value } }) => (

                                            <TextField
                                                value={value}
                                                id="outlined-basic"
                                                label="Latitude"
                                                variant="outlined"
                                                sx={{ mt: "24px" }}
                                                disabled
                                                InputLabelProps={{ shrink: !!watch("latitude") }}
                                                error={!!locationErrors.latitude}
                                                helperText={!!locationErrors?.latitude && locationErrors?.latitude.message}
                                                fullWidth
                                                size="small"
                                                {...locationRegister("latitude", {
                                                    required: ValidationMessages.FIELD_REQUIRED,
                                                    validate: {
                                                        maxLength: (v) =>
                                                            v > 2 ||
                                                            "Your Longitude should contain Atleast 3 Characters",
                                                    },
                                                })}
                                            />
                                        )}
                                    />

                                </Grid>
                                <Grid item xs={6} sm={6}>
                                    <Controller
                                        name='zipCode'
                                        control={locationControl}
                                        render={({ field: { value } }) => (

                                            <TextField
                                                value={value}
                                                id="outlined-basic"
                                                label="Postal Code"
                                                variant="outlined"
                                                sx={{ mt: "24px" }}
                                                InputLabelProps={{ shrink: !!watch("zipCode") }}
                                                error={!!locationErrors.zipCode}
                                                helperText={!!locationErrors?.zipCode && locationErrors?.zipCode.message}
                                                fullWidth
                                                size="small"
                                                {...locationRegister("zipCode", {
                                                    required: ValidationMessages.FIELD_REQUIRED,
                                                    validate: {
                                                        maxLength: (v) =>
                                                            v.length > 2 ||
                                                            "Your Zip Code should contain Atleast 3 Characters",
                                                    },
                                                })}
                                            />
                                        )}
                                    />

                                </Grid>
                                <Grid item xs={6} sm={6}>
                                    <Controller
                                        name='landmark'
                                        control={locationControl}
                                        render={({ field: { value } }) => (

                                            <TextField
                                                value={value}
                                                id="outlined-basic"
                                                label="Land Mark"
                                                variant="outlined"
                                                sx={{ mt: "24px" }}
                                                InputLabelProps={{ shrink: !!watch("landmark") }}
                                                error={!!locationErrors.landmark}
                                                helperText={!!locationErrors?.landmark && locationErrors?.landmark.message}
                                                fullWidth
                                                size="small"
                                                {...locationRegister("landmark", {
                                                    required: ValidationMessages.FIELD_REQUIRED,
                                                    validate: {
                                                        maxLength: (v) =>
                                                            v.length > 2 ||
                                                            "Your Land Mark should contain Atleast 3 Characters",
                                                    },
                                                })}
                                            />
                                        )}
                                    />

                                </Grid>
                            </Grid>
                            <Box display="flex" justifyContent="space-between">
                                <Button

                                    onClick={handlePrev}
                                    variant="contained"
                                    sx={{ mt: "24px" }}
                                    startIcon={<ArrowBackIcon />}
                                >
                                    PREV
                                </Button>
                                <Button
                                    type='submit'
                                    variant="contained"

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
                    </Box>
                }
                {activeStep === 2 &&
                    <Box mt={4}>
                        <Box component="form" onSubmit={adminHandleSubmit(onAdminSubmit)}>
                            <Controller
                                name='name'
                                control={adminControl}
                                render={({ field: { value } }) => (
                                    <TextField
                                        value={value}
                                        id="outlined-basic"
                                        label="Name"
                                        variant="outlined"
                                        sx={{ mt: "24px" }}
                                        InputLabelProps={{ shrink: !!adminWatch("name") }}
                                        error={!!adminErrors.name}
                                        helperText={!!adminErrors?.name && adminErrors?.name.message}
                                        fullWidth
                                        size="small"
                                        {...adminRegister("name", {
                                            required: ValidationMessages.FIELD_REQUIRED,
                                            validate: {
                                                maxLength: (v: string) =>
                                                    v.length > 2 ||
                                                    "Your name should contain Atleast 3 Characters",
                                            },
                                        })}
                                    />
                                )}
                            />
                            <Controller
                                name='email'
                                control={adminControl}
                                render={({ field: { value } }) => (
                                    <TextField
                                        value={value}
                                        id="outlined-basic"
                                        label="E-mail"
                                        variant="outlined"
                                        sx={{ mt: "17px" }}
                                        error={!!adminErrors.email}
                                        helperText={!!adminErrors?.email && adminErrors?.email.message}
                                        fullWidth
                                        size="small"
                                        {...adminRegister("email", {
                                            required: ValidationMessages.FIELD_REQUIRED,
                                            validate: {
                                                maxLength: (v) =>
                                                    v.length <= 50 ||
                                                    "The Email should have at most 50 characters",
                                                matchPattern: (v) =>
                                                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                                                    "Email address must be a valid address",
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
                                    error={!!adminErrors?.password}
                                >
                                    Password
                                </InputLabel>
                                <Controller
                                    name='password'
                                    control={adminControl}
                                    render={({ field: { value } }) => (
                                        <OutlinedInput
                                            value={value}
                                            id="outlined-adornment-password"
                                            type={showPassword ? "text" : "password"}
                                            {...adminRegister("password", {
                                                required: "This Field is required",
                                                validate: {
                                                    maxLength: (v) =>
                                                        v.length > 2 ||
                                                        "Your password should contain Atleast 3 Characters",
                                                },
                                            })}
                                            error={!!adminErrors?.password}
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

                                {!!adminErrors?.password && (
                                    <FormHelperText error id="password-error">
                                        {adminErrors?.password?.message}
                                    </FormHelperText>
                                )}
                            </FormControl>

                            <Grid container spacing={1}>
                                <Grid item xs={6} sm={4}>

                                    <Controller
                                        name='countryCode'
                                        control={adminControl}
                                        render={({ field: { value } }) => (
                                            <Autocomplete
                                                size="small"
                                                sx={{ mt: "17px" }}
                                                filterOptions={filterOptions}
                                                getOptionLabel={(getDialCodes: any) =>
                                                    getDialCodes.dial_code
                                                }
                                                defaultValue={null}
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
                                                        <TextField
                                                            value={value}
                                                            {...adminRegister("countryCode", {
                                                                required: ValidationMessages.FIELD_REQUIRED,
                                                            })}
                                                            {...params}
                                                            label="Country code"
                                                            error={!!adminErrors.countryCode}
                                                            helperText={
                                                                !!adminErrors?.countryCode && adminErrors?.countryCode.message
                                                            }
                                                        />
                                                    );
                                                }}
                                            />
                                        )}
                                    />


                                </Grid>
                                <Grid item xs={6} sm={8}>

                                    <Controller
                                        name='phone'
                                        control={adminControl}
                                        render={({ field: { value } }) => (

                                            <TextField
                                                value={value}
                                                id="outlined-basic"
                                                label="Phone Number"
                                                variant="outlined"
                                                sx={{ mt: "17px" }}
                                                error={!!adminErrors.phone}
                                                helperText={
                                                    !!adminErrors?.phone && adminErrors?.phone.message
                                                }
                                                fullWidth
                                                size="small"
                                                {...adminRegister("phone", {
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
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                            <Controller
                                name='pin'
                                control={adminControl}
                                render={({ field: { value } }) => (

                                    <TextField
                                        value={value}
                                        id="outlined-basic"
                                        label="Postal Code"
                                        variant="outlined"
                                        sx={{ mt: "24px" }}
                                        InputLabelProps={{ shrink: !!adminWatch("pin") }}
                                        error={!!adminErrors.pin}
                                        helperText={!!adminErrors?.pin && adminErrors?.pin.message}
                                        fullWidth
                                        size="small"
                                        {...adminRegister("pin", {
                                            required: ValidationMessages.FIELD_REQUIRED,
                                            validate: {
                                                maxLength: (v) =>
                                                    v.length > 2 ||
                                                    "Your Pin Code should contain Atleast 3 Characters",
                                            },
                                        })}
                                    />
                                )}
                            />

                            <Box display="flex" justifyContent="space-between">
                                <Button
                                    variant="contained"
                                    sx={{ mt: "24px" }}
                                    startIcon={<ArrowBackIcon />}
                                    onClick={handlePrev}
                                >
                                    PREV
                                </Button>
                                <Button
                                    type='submit'
                                    variant="contained"

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
                    </Box>}
                {activeStep === 3 && <Box mt={4}>
                    Done
                </Box>}
            </CardContent></Card>
    )
}

export default StoreDetailStepper