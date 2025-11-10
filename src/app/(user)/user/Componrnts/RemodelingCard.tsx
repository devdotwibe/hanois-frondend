import React from 'react';
import Image from 'next/image';
import moreoptions from "../../../../../public/images/more-options-icon.svg"

type RemodelingCardProps = {
  title?: string;
  description?: string;
  date?: string;
  place?: string;
proposal?: string;
}

const RemodelingCard: React.FC<RemodelingCardProps> = ({
  title,
  description,
  date,
  place,
  proposal
  
}) => {
 

 
  return (
    <div className='remodeling-card'>




      <div className="remodel-div1">
        <h4 className="">{title}</h4>
         <button >
          <Image 
          src={moreoptions}
          alt='img'
          width={20}
          height={20}
          className='more-option-btn'
          
          />
        </button>
      </div>




      <h5 className="">{description}</h5>





      <div className="remodel-div2">

        <div className="remodel-col1">

          <div className="re-col1">
              <p className="">
            <span className="">Date added</span>
          </p>
            
          </div>
          <div className="re-col1">

             <p className="">
            <span className="">{date}</span>
          </p>
          </div>
        </div>



        <div className="remodel-col1">

          <div className="re-col1">
              <p className="">
            <span className="">Location</span>
          </p>
            
          </div>
          <div className="re-col1">

             <p className="">
            <span className="">{place}</span>
          </p>
          </div>
        </div>


      </div>



    





      <div className="proposals">
        <p className="">
       {proposal}
        </p>
      </div>
    </div>
  );
};

export default RemodelingCard;