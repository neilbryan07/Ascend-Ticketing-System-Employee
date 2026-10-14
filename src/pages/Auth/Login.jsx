import React , {  useEffect, useState } from 'react'
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import SendIcon from '@mui/icons-material/Send';
import CircularProgress from '@mui/material/CircularProgress';

import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { particles_link , pageRoutes } from '../../contants';

import { APIServices } from '../../hooks/fetchAPI';


import { Link, useNavigate } from "react-router-dom";

import { Alert, AlertTitle } from '@mui/material';


const Login = () => {

    // const [init, setInit] = useState(false);
    const [screenHeight, setScreenHeight] = useState(window.innerHeight);
    const [ screenWidth, setScreenWidth ] = useState(window.innerWidth);

    const [containerWidth, setContainerWidth] = useState(null);

    const [ loader , setLoader ] = useState(false);
    const [ success , setSuccess ] = useState(false);
    const [ error , setError ] = useState(false);
    const [ alertMessage , setAlertMessage ] = useState('');

    const handleResize = () => {
    
        setScreenHeight(window.innerHeight);
        setScreenWidth(window.innerWidth);
    };

    useEffect(() => {

        initParticlesEngine(async (engine) => {
            await loadFull(engine);

        }).then(() => {
        // setInit(true);
        });

        window.addEventListener('resize', handleResize);

        // Remove event listener when the component unmounts
        return () => {
          window.removeEventListener('resize', handleResize);
        };

    }, []);

    const navigate = useNavigate();

    const [values, setValues] = useState({
        username: '',
        password: '',
        showPassword: false,
    });

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
      };
    
    const handleClickShowPassword = () => {
        setValues({
          ...values,
          showPassword: !values.showPassword,
        });
    };
    
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };


    const ColorButton = styled(Button)(({ theme }) => ({
        color: 'white',
        backgroundColor: '#436850',
        '&:hover': {
          backgroundColor: '#12372A',
        },
    }));

    const handleSignIn = async () => {
    
        setLoader(true);
        setError(false);

        const res = await APIServices.post({ url: '/employee-module/login' , payload: values })
        if ( res.status === 200 && !res.data.error ) {
            localStorage.setItem('access_token', res.data.access_token)
            setLoader(false);
            setSuccess(true);
            navigate(pageRoutes.TICKET)
        } else {
  
            setAlertMessage( res.data.message )
            setError(true);
            setLoader(false);
        }

    }

  return (
    <div className="h-screen w-full flex justify-center bg-[#12372A]">

        {
            window.innerWidth >= 800 ? 
            <Particles
                id="tsparticles"
                options={particles_link}
            /> : null
        }
        

        <div className={`w-6/12 max-[1600px]:w-8/12 max-[1200px]:w-11/12 absolute ${ screenHeight > 700 ? 'top-36' : 'top-5' } top-36 max-h-[700px]:top-5 grid grid-cols-2 max-[800px]:grid-cols-1`}>
       
            <div className='w-full bg-[#436850] p-4 flex flex-col items-center max-[800px]:hidden'>
                
                <img  className='max-h-[427px] max-w-[427px] max-[900px]:max-h-[327px]  max-[900px]:max-w-[327px]' src={require('../../assets/images/Svg/Login_Display.png')} alt=""/>
                <img className='w-5/12 mt-6' src={require('../../assets/images/next-logo-white.png')} alt=""/>
                <span className='text-sm text-white mt-4'>Powered by</span>
            </div>

            <div className='w-full bg-slate-100 flex items-center flex-col'>

            {/* Logo */}
            <div className='mt-20 w-full flex justify-center'>
                {/* <h1 className='font-bold text-3xl text-sky-600'>Ticket</h1> */}
                <img  className='max-h-[75px] max-w-[75px] w-full h-full' src={require('../../assets/images/Svg/user_login.png')} alt=""/>
            </div>

            {/* Form */}

            <div className='mt-3 flex justify-center flex flex-col items-center'>
                <h1 className='font-semibold text-2xl text-[#12372A]'>Employee Portal</h1>
                <h1 className='text-md font-light mt-2'>Hello! Let's get started</h1>
            </div>

            <div className='mt-1 w-3/4'>

                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                    <AccountCircleIcon sx={{ color: '#436850', mr: 2, my: 0.5 }} />
                    <TextField fullWidth  id="input-with-sx" label="Username" variant="standard"
                        value={values.username}
                        onChange={handleChange('username')}
                    />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-end',marginTop:1.5 }}>
                    <LockIcon sx={{ color: '#436850', mr: 2, my: 0.5 }} />
                    {/* <TextField fullWidth  id="input-with-sx" label="Password" variant="standard" type="password" /> */}
                    <FormControl fullWidth variant="standard">
                    <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                    <Input
                        id="standard-adornment-password"
                        type={values.showPassword ? 'text' : 'password'}
                        value={values.password}
                        onChange={handleChange('password')}
                        endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            >
                            {values.showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                        }
                    />
                    </FormControl>
                </Box>

            </div>

            <div className='mb-10 mt-5 flex flex-col w-3/4'>
    
                <ColorButton variant="contained" endIcon={ loader ? <CircularProgress size={20} color={'inherit'} />  : <SendIcon />} onClick={ () =>  handleSignIn()  }>Sign-In</ColorButton>

                <div className='flex flex-row mt-3 items-center self-center'>
                    <Checkbox defaultChecked sx={{ color: 'rgb(67,104,80)', '&.Mui-checked': { color: 'rgb(67,104,80)',},}} />
                    <span className='text-md text-slate-700'>Remember Me</span>
                </div>

            </div>

            { error ? 
                    <Alert severity="error">{alertMessage}</Alert>
                    // <Alert severity="error">
                    //     <AlertTitle>{alertMessage}</AlertTitle>
                    // </Alert> 
                : null  }

            { success ? 
                    <Alert severity="success">Welcome User</Alert>
            : null  }


            {
                window.innerWidth <= 800 ? 

                <div className='w-full flex flex-col items-center justify-center bg-[#436850] py-5'>
                    <img className='w-5/12' src={require('../../assets/images/next-logo-white.png')} alt=""/>
                    <span className='text-sm text-white mt-4'>Powered by</span>
                </div>
                : null
            }

            </div>
        
        </div>

    </div>
  )
}

export default Login
