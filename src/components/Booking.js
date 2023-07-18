import Select from 'react-select'
import React, { useState, useEffect } from 'react';
import {
    getAllBookings,
    createBooking,
    deleteBooking,
    updateBooking
} from '../helper/bookingHelper.js';
import { getCustomers } from '../helper/helper.js';
import { getAllGrades } from '../helper/gradeHelper.js';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, Navigate } from 'react-router-dom';

export default function Booking() {
    const [data, setData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newData, setNewData] = useState({})
    const [customers, setCustomers] = useState([])
    const [grades, setGrade] = useState([])
    const navigate = useNavigate();
    const handleSelectCustomer = (event, meta) => {
        setNewData({ ...newData, [meta.name]: event.value });
    }
    const handleSelectGrade = (event, meta) => {
        setNewData({ ...newData, [meta.name]: event.value });
    }
    let optionsCustomer = customers.map(function (customer) {
        return { value: customer._id, label: customer.username };
    })
    let optionsGrade = grades.map(function (grade) {
        return { value: grade._id, label: grade.gradeName };
    })
    let roleId = localStorage.getItem('roleId');
    let token = localStorage.getItem('token');
    const fetchData = async () => {
        const grades = await getAllGrades()
        const customers = await getCustomers()
        const response = await getAllBookings();
        setData(response.data);
        setCustomers(customers.data);
        setGrade(grades.data)
        // console.log(data)

    }

    useEffect(() => {
        if (roleId < 3) {
            navigate('*');
        } else if (token == null) {
            navigate('*');
        } else {
            let dataPromise = fetchData();
            toast.promise(dataPromise, {
                loading: 'Loading...',
                success: <b>Successfully...!</b>,
                error: <b>Failed !!!</b>
            })
            dataPromise.then(function () { navigate('/booking') }).catch(error => {
                console.error(error);
            });
        }

    }, []);

    const handleDelete = async (event, id) => {
        event.currentTarget.disabled = true;
        try {
            await deleteBooking(id);
            let dataPromise = fetchData();
            toast.promise(dataPromise, {
                loading: 'Loading...',
                success: <b>Successfully...!</b>,
                error: <b>Failed !!!</b>
            })
            dataPromise.then(function () { navigate('/booking') }).catch(error => {
                console.error(error);
            });
        } catch (error) {
            console.error(error)
        }
    }
    const handleCreate = async (event, data) => {
        // event.preventDefault()
        try {
            let createPromise = await createBooking(data);
            setShowModal(false);
            let dataPromise = fetchData();
            toast.promise(dataPromise, {
                loading: 'Loading...',
                success: <b>Successfully...!</b>,
                error: <b>Failed !!!</b>
            })
            dataPromise.then(function () { navigate('/booking') }).catch(error => {
                console.error(error);
            });


        } catch (error) {
            console.error(error)
        }
    }
    const createModal = () => {
        setShowModal(true);
    }
    const handleUpdate = async (event, id) => {
        event.currentTarget.disabled = true;
        // event.preventDefault()
        try {
            const response = await updateBooking(id); // Call your update function to update the user data
            setShowModal(false);
            let dataPromise = fetchData();
            toast.promise(dataPromise, {
                loading: 'Loading...',
                success: <b>Successfully...!</b>,
                error: <b>Failed !!!</b>
            })
            dataPromise.then(function () { navigate('/booking') }).catch(error => {
                console.error(error);
            });
        } catch (error) {
            console.error(error);
        }
    }
  // Tính toán các chỉ số cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingPerPage, setBookingPerPage] = useState(10);

  const indexOfLastBooking = currentPage * bookingPerPage;
  const indexOfFirstUser = indexOfLastBooking - bookingPerPage;
  const currentdata = data.slice(indexOfFirstUser, indexOfLastBooking);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
    return (


        <div className='max-w-4x2' style={{marginLeft: '15rem'}}>
            <Toaster position='top-center' reverseOrder={false}></Toaster>
            <div class="">
                <div>
                    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => createModal()}>
                        New Booking
                    </button>
                </div>
                <table className='w-full whitespace-nowrap bg-white overflow-hidden rounded-lg shadow-sm mb-8'>
                    <thead>
                        <tr className='text-left font-bold'>
                            <th className='px-6 pt-5 pb-4'>Grade name</th>
                            <th className='px-6 pt-5 pb-4'>Username</th>
                            <th className='px-6 pt-5 pb-4'>Created At</th>
                            <th className='px-6 pt-5 pb-4'>Status</th>
                            <th className='px-6 pt-5 pb-4'>Action</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200'>
                        {currentdata.map((data) => (
                            <tr key={data._id}>


                                <td className='px-6 py-4'>{grades.map((grade) => {
                                    // {
                                    //   if(data._id == user._id)  [user.username]
                                    // }
                                    if (data.grade == grade._id) // where dataid === courseid =
                                        return grade.gradeName

                                    // data cua? booking
                                })}</td>
                                <td className='px-6 py-4'>{customers.map((customer) => {
                                    // {
                                    //   if(data._id == user._id)  [user.username]
                                    // }
                                    if (data.user == customer._id)
                                        return customer.username

                                    // data cua? booking
                                })}</td>
                                <td className='px-6 py-4'>{data.createdAt}</td>
                                <td className='px-6 py-4'>{data.isAccepted}</td>
                                <td className='px-6 py-4'>
                                    {data.isAccepted == 0 &&
                                        <button
                                            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2'
                                            onClick={(event) => handleUpdate(event, data._id)}
                                        >
                                            Accept
                                        </button>
                                    }

                                    <button
                                        className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
                                        onClick={(event) => handleDelete(event, data._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {showModal ? (
                    <>
                        <div

                            className="justify-center items-center  overflow-x-hidden overflow-y-auto fixed inset-1 z-50 outline-none focus:outline-none"
                        >
                            <div className="relative w-auto my-6 mx-auto max-w-3xl">
                                {/*content*/}
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                    {/*header*/}
                                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                        <h3 className="text-3xl font-semibold">
                                            Create Booking
                                        </h3>
                                        <button
                                            className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                            onClick={() => setShowModal(false)}
                                        >
                                            <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                                ×
                                            </span>
                                        </button>
                                    </div>
                                    {/*body*/}
                                    <form>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-bold mb-2">Grade :</label>
                                            <Select options={optionsGrade} name="grade" onChange={(event, meta) => handleSelectGrade(event, meta)} />
                                        </div>


                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-bold mb-2">Customer :</label>
                                            <Select options={optionsCustomer} name="user" onChange={(event, meta) => handleSelectCustomer(event, meta)} />
                                        </div>


                                        <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                            <button
                                                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                type="button"
                                                onClick={() => setShowModal(false)}
                                            >
                                                Close
                                            </button>
                                            <button
                                                className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                onClick={(event) => handleCreate(event, newData)}                                        >
                                                Create
                                            </button>
                                        </div>
                                        {/* <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                        Update
                                    </button> */}
                                    </form>
                                    {/*footer*/}

                                </div>
                            </div>
                        </div>
                        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                    </>
                ) : null}
                  <Pagination
        bookingPerPage={bookingPerPage}
        totalBooking={data.length}
        currentdata={currentPage}
        paginate={paginate}
      />
            </div >

        </div>

    )
}const Pagination = ({ bookingPerPage, totalBooking, currentdata, paginate }) => {
    const pageNumbers = [];
  
    for (let i = 1; i <= Math.ceil(totalBooking / bookingPerPage); i++) {
      pageNumbers.push(i);
    }
  
    return (
      <div className="mt-4 flex justify-center">
        <ul className="inline-flex space-x-2">
          {pageNumbers.map((number) => (
            <li key={number}>
              <button
                onClick={() => paginate(number)}
                className={`rounded-lg px-3 py-1 ${
                  number === currentdata
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {number}
              </button>
            </li>
          ))}
          
        </ul>
      </div>
    );
  };
  