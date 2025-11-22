"use client";
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import profile from "../../../../../public/images/profile.png";
import tik from "../../../../../public/images/tik.svg";
import { API_URL,IMG_URL } from "@/config";


const MyAccountForm = () => {


  const [User, setUser] = useState([]);

  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [errors, setErrors] = useState({});

  const [errorMsg, setErrorMsg] = useState("");

  // const [successMsg, setSuccessMsg] = useState("profile updated sucessfully");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {

    const fetchUser = async () => {

      try {
        const token = localStorage.getItem("token");

        const userData = JSON.parse(localStorage.getItem("user"));

        const userId = userData?.id;

        if (!token || !userId) {

          window.location.href = "/login";

          return;
        }

        const res = await fetch(`${API_URL}users/get`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        if (data?.error === "Access token is required" || data?.error === "Invalid or expired token") {

          localStorage.removeItem("token");

          window.location.href = "/login";
          return;
        }


        setUser(data?.data);
        setName(data?.data?.name || "");
        setPhone(data?.data?.phone || "");
        setProfileImage(data?.data?.profile_image);

      } catch (err) {

        console.error("Fetch error:", err);
      } finally {

        setLoading(false);
      }
    };

    fetchUser();
  }, []);


   const handleImageChange = (e) => {

        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
          setErrorMsg("Please upload a valid image file.");
          return;
        }

        if (file.size > 2 * 1024 * 1024) {
          setErrorMsg("Image size must be below 2MB.");
          return;
        }

        setProfileImage(file);
        setPreviewImage(URL.createObjectURL(file));
    };

    const handleRemoveImage = () => {

        setProfileImage(null);
        setPreviewImage(null);
        setErrorMsg("");

        const input = document.getElementById("profile_image");
        if (input) input.value = "";
    };



      const handleSubmit = async (e) => {

          e.preventDefault();
          setErrorMsg("");
          setSuccessMsg("");

           let temp = {};

          if (!name) temp.name = "Name is required";
          // if (!email) temp.email = "Email is required";

          if (!phone) temp.phone = "Phone is required";

          // if (!password) temp.password = "Password is required";

          setErrors(temp);

            if (Object.keys(temp).length === 0) {

                const token = localStorage.getItem("token");

                if (!token) return setErrorMsg("Unauthorized. Please login again.");

                try {

                  const formData = new FormData();
                  formData.append("name", name);
                  formData.append("phone", phone);

                  if (profileImage) {
                    formData.append("profile_image", profileImage);
                  }

                  const res = await fetch(`${API_URL}users/update-profile`, {

                    method: "POST",
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                  });

                  const data = await res.json();

                  if (!data.success) {

                    setErrorMsg(data.message || "Something went wrong.");
                    return;
                  }

                  setSuccessMsg("Profile updated successfully!");

                  if (data.data.profile_image) {

                    setProfileImage(data.data.profile_image);
                  }

                } catch (err) {

                  console.error(err);
                  setErrorMsg("Server error. Try again later.");
                }

            }
        };


        console.log(profileImage,'profileImage');

  return (
    <div className='my-account-form'>
      <div className="proj-text">
        <h2>My Account</h2>
      </div>

      <div className="profile-container">

        <div className="profile-up">

          {previewImage && (

            <Image
              src={previewImage || profile}
                alt="Profile"
                width={100}
                height={100}
                className="profile-avatar"
              />
          )}

          {profileImage && !previewImage && (

            <img

              src={`${IMG_URL}uploads/${profileImage}`}
              alt="Profile"
              width={100}
              height={100}
              className="profile-avatar"
            />
          )}

           {!previewImage && !profileImage && (

            <label htmlFor="profile_image" className='upload-btn'>

             Upload new picture
              {/* <button type="button" className="">
                Upload new picture
              </button> */}
            </label>

          )}

            <input
              type="file"
              id="profile_image"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none", cursor:"pointer" }}
            />

            {previewImage || profileImage && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="remove-btn1"
                style={{ cursor:"pointer" }}
                >
                  X
                </button>
            )}

        </div>


        {errorMsg &&
         <p style={{ color: "red" }}>{errorMsg}</p>}


         <form className="profile-form" onSubmit={handleSubmit}>


           {successMsg
         &&
         <div className="add-sucess myaccount-suc">
<p style={{ color: "green" }}>
  <span>
    <Image
    src={tik}
    alt='img'
    width={18}
    height={18}
    />
  </span>
  {successMsg}
         </p>
         </div>




         }






          <div className="form-grp">

            <label>Name</label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {errors.name && <p style={{ color: "red", margin: 0 }}>{errors.name}</p>}

          </div>


          <div className="form-grp prev-disabled">
            <label>Email</label>
             <input type="email"  value={User?.email || ""} disabled />

             {errors.email && <p style={{ color: "red", margin: 0 }}>{errors.email}</p>}

          </div>


          <div className="form-grp">

            <label>Mobile phone</label>

             <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            {errors.phone && <p style={{ color: "red", margin: 0 }}>{errors.phone}</p>}

          </div>

          <div className="profile-actions">

            <button type="button" className="change-btn">
              Change Password
            </button>
            <button type="submit" className="save-btn1 dark-btn save-account">
              Save
            </button>

          </div>

        </form>


      </div>

    </div>
  )
}

export default MyAccountForm
