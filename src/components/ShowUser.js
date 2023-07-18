import React, { useState, useEffect } from "react";
import { getAllUser, deleteUser, updateUser_1 } from "../helper/helper";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ShowUsers() {
  const [data, setData] = useState([]);
  const [updatedUserData, setUpdatedUserData] = useState({});

  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const handleChange = (event) => {
    setUpdatedUserData({
      ...updatedUserData,
      [event.target.name]: event.target.value,
    });
  };
  let roleId = localStorage.getItem("roleId");
  let token = localStorage.getItem("token");

  const fetchData = async () => {
    const response = await getAllUser();
    setData(response.data);
  };
  useEffect(() => {
    if (roleId < 3) {
      navigate("*");
    } else if (token == null) {
      navigate("*");
    } else {
      let dataPromise = fetchData();
      toast.promise(dataPromise, {
        loading: "Loading...",
        success: <b>Successfully...!</b>,
        error: <b>Failed !!!</b>,
      });
      dataPromise
        .then(function () {
          navigate("/showUser");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  const handleDelete = async (userId) => {
    try {
      const response = await deleteUser(userId);
      let dataPromise = fetchData();
      toast.promise(dataPromise, {
        loading: "Loading...",
        success: <b>Successfully...!</b>,
        error: <b>Failed !!!</b>,
      });
      dataPromise
        .then(function () {
          navigate("/showUser");
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (user) => {
    setUpdatedUserData(user);
    setShowModal(true);
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      const response = await updateUser_1(updatedUserData._id, updatedUserData); // Call your update function to update the user data
      setShowModal(false);
      let dataPromise = fetchData();
      toast.promise(dataPromise, {
        loading: "Loading...",
        success: <b>Successfully...!</b>,
        error: <b>Failed !!!</b>,
      });
      dataPromise
        .then(function () {
          navigate("/showUser");
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  };
  // Tính toán các chỉ số cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [userPerPage, setUserPerPage] = useState(10);

  const indexOfLastUser = currentPage * userPerPage;
  const indexOfFirstUser = indexOfLastUser - userPerPage;
  const currentdata = data.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <div className="max-w-4x2" style={{ marginLeft: "15rem" }}>
      <Toaster position='top-center' reverseOrder={false}></Toaster>
      <table className="mb-8 w-full overflow-hidden whitespace-nowrap rounded-lg bg-white shadow-sm">
        <thead>
          <tr className="text-left font-bold">
            <th className="px-6 pb-4 pt-5">Name</th>
            <th className="px-6 pb-4 pt-5">Email</th>
            <th className="px-6 pb-4 pt-5">Role</th>
            <th className="px-6 pb-4 pt-5">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {currentdata.map((user) => (
            <tr key={user._id}>
              <td className="px-6 py-4">{user.username}</td>
              <td className="px-6 py-4">{user.email}</td>
              <td className="px-6 py-4">{user.roleId}</td>
              <td className="px-6 py-4">
                {roleId == 4 && (
                  <>
                    <button
                      className="mr-2 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal ? (
        <>
          <div className="fixed inset-1  z-50 items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
            <div className="relative mx-auto my-6 w-auto max-w-3xl">
              {/*content*/}
              <div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between rounded-t border-b border-solid border-slate-200 p-5">
                  <h3 className="text-3xl font-semibold">Update User</h3>
                  <button
                    className="float-right ml-auto border-0 bg-transparent p-1 text-3xl font-semibold leading-none text-black opacity-5 outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="block h-6 w-6 bg-transparent text-2xl text-black opacity-5 outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <form>
                  <div className="mb-4">
                    <label className="mb-2 block font-bold text-gray-700">
                      Name:
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={updatedUserData.username}
                      onChange={handleChange}
                      className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="mb-2 block font-bold text-gray-700">
                      Email:
                    </label>
                    <input
                      type="text"
                      name="email"
                      value={updatedUserData.email}
                      onChange={handleChange}
                      className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="mb-2 block font-bold text-gray-700">
                      Role:
                    </label>
                    <input
                      type="text"
                      name="role"
                      value={updatedUserData.roleId}
                      onChange={handleChange}
                      className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center justify-end rounded-b border-t border-solid border-slate-200 p-6">
                    <button
                      className="background-transparent mb-1 mr-1 px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none"
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      Close
                    </button>
                    <button
                      className="mb-1 mr-1 rounded bg-emerald-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
                      onClick={(event) => handleUpdate(event)}
                    >
                      Save Changes
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
          <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
        </>
      ) : null}
      <Pagination
        userPerPage={userPerPage}
        totalUser={data.length}
        currentdata={currentPage}
        paginate={paginate}
      />
    </div>
  );
}

// Component phân trang
const Pagination = ({ userPerPage, totalUser, currentdata, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalUser / userPerPage); i++) {
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
