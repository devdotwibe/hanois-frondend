"use client";
import React from "react";
import Image from "next/image";
import uploadIcon from "../../../../../../../public/images/upload.svg";
import HouseOuter from "../../Components/HouseOuter"; // <-- add this import

const UploadBox = () => {
  return (
    <>
      <HouseOuter />           {/* <-- render it here, outside the upload-box */}
      <div className="upload-box">
        <div className="upload-content">
          <Image
            src={uploadIcon}
            alt="Upload Icon"
            width={40}
            height={40}
            className="upload-icon"
          />

          <h3>Upload an image</h3>
          <p>Browse your files To upload Document</p>
          <span>Supported Formats: JPEG, PNG</span>
        </div>

        <input type="file" accept="image/*" className="upload-input hidden" />
      </div>
    </>
  );
};

export default UploadBox;
