"use client";
import React from "react";
import Image, { StaticImageData } from "next/image";

type DetailCardProps = {
  logo: string | StaticImageData;
  name: string;
  description?: string;
 categories: Array<any>;
  providerCategories: (number | string)[];
  loadingCategories?: boolean;};

const DetailCard: React.FC<DetailCardProps> = ({
  logo,
  name,
  description,
  categories,
  providerCategories,
  loadingCategories = false,}) => {
  const isString = typeof logo === "string";

  return (
    <div className="house-card detail-card">
      <div className="house-card-logo">
        <div className="h-logodiv">
          {isString ? (
            <img src={logo} alt={`${name} logo`} width={180} height={128} className="house-card-img" />
          ) : (
            <Image src={logo} alt={`${name} logo`} width={180} height={128} className="house-card-img" />
          )}
        </div>
      </div>

      <div className="house-card-info">

{/* Dynamic Categories */}
  <div className="outline-row">
    {Array.isArray(providerCategories) && providerCategories.length > 0 ? (
      providerCategories.map((catId) => {
        // if categories still loading, show placeholder
        if (loadingCategories || !Array.isArray(categories) || categories.length === 0) {
          return (
            <div key={String(catId)} className="outline-items">
              <p style={{ opacity: 0.6, fontStyle: "italic" }}>Loading categories…</p>
            </div>
          );
        }

        const category = categories.find((c) => String(c?.id) === String(catId));
        if (!category) {
          return (
            <div key={String(catId)} className="outline-items">
              <p style={{ opacity: 0.6, fontStyle: "italic" }}>{`Category #${String(catId)}`}</p>
            </div>
          );
        }

        return (
          <div key={String(catId)} className="outline-items">
            <p>{category.name}</p>
          </div>
        );
      })
    ) : (
      <div className="outline-items">
        <p style={{ opacity: 0.6, fontStyle: "italic" }}>No categories</p>
      </div>
    )}
  </div>


        <h2 className="house-card-title">{name}</h2>
        {description && <p className="house-card-desc">{description}</p>}
      </div>
    </div>
  );
};
export default DetailCard;




 
// "use client";
// import React from "react";
// import Image, { StaticImageData } from "next/image";

// type DetailCardProps = {
//   logo: string | StaticImageData; 
//   name: string;
//   description?: string;
// };

// const DetailCard: React.FC<DetailCardProps> = ({ logo, name, description }) => {
//   return (
//     <div className="house-card detail-card">

        
   
//       <div className="house-card-logo">

//         <div className="h-logodiv">
//              <Image
//           src={logo}
//           alt={`${name} logo`}
//           width={180}
//           height={128}
//           className="house-card-img"
//         />

//         </div>
       
//       </div>

     
//       <div className="house-card-info">


//         <div className="outline-row">
//              <div className="outline-items">

//             <p>Architecture</p>

//         </div>

//         <div className="outline-items">

//             <p>Interior</p>

//         </div>

//         </div>

       



//         <h2 className="house-card-title">{name}</h2>
//         {description && <p className="house-card-desc">{description}</p>}

//       </div>
//     </div>
//   );
// };

// export default DetailCard;
