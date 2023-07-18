import React, { useState } from 'react'
import avatar from '../assets/profile.png';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { profileValidation } from '../helper/validate';
import convertToBase64 from '../helper/convert';
import useFetch from '../hooks/fetch.hook';
import { updateUser } from '../helper/helper'
import { useNavigate } from 'react-router-dom'


import '../styles/profile.css'
export default function Profile() {

  const [file, setFile] = useState();
  const [{ isLoading, apiData, serverError }] = useFetch();
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      phone: apiData?.phone || '',
      email: apiData?.email || '',
      description: apiData?.description || '',
      address: apiData?.address || ''
    },
    enableReinitialize: true,
    validate: profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      values = await Object.assign(values, { profile: file || apiData?.profile || '' })
      let updatePromise = updateUser(values);

      toast.promise(updatePromise, {
        loading: 'Updating...',
        success: <b>Update Successfully...!</b>,
        error: <b>Could not Update!</b>
      });

    }
  })

  /** formik doensn't support file upload so we need to create this handler */
  const onUpload = async e => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  }

  // logout handler function
  function userLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('roleId');
    localStorage.removeItem('username');
    navigate('/')
  }

  if (isLoading) return <h1 className='text-2xl font-bold' style={{ marginLeft: '2rem' }}>isLoading</h1>;
  if (serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>
  
  return (
    <div className="max-w-4x2 max-h-4x2 background_img">
    <h1 className="title">YOGALIFE EDIT YOUR PROFILE</h1>
    <Toaster position='top-center' reverseOrder={false}></Toaster>

    <div className="formContainer">
      <div className="formBox">

        <div className="title">
          <h4 className="titleText">Profile</h4>

          <span className="subtitle">
            You can update the details.
          </span>
        </div>

        <form className="form" onSubmit={formik.handleSubmit}>
          <div className="avatarContainer">
            <label htmlFor="profile">
      <img src={avatar} className="avatar" alt="avatar" />
            </label>

            <input onChange={onUpload} type="file" id='profile' name='profile' />
          </div>

          <div className="inputContainer">
            
            <input {...formik.getFieldProps('phone')} className="input" type="text" placeholder='Mobile No.' />
            <input {...formik.getFieldProps('email')} className="input" type="text" placeholder='Email*' />
            <input {...formik.getFieldProps('address')} className="input" type="text" placeholder='Address' />
            <input {...formik.getFieldProps('description')} className="input" type="text" placeholder='Description*' />
            <button className="button" type='submit'>Update</button>
          </div>
          <div >
  <img src="http://localhost:3000/static/media/logo.21031b5d746360af3610.png" alt="Logo" />
</div>
        </form>

      </div>
    </div>
  </div>
)
}