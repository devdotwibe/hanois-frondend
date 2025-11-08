import React from 'react';

type RemodelingCardProps = {
  title: string;
  description: string;
  date: string;
  place: string;
proposal: string;
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
        </button>
      </div>

      <h5 className="">{description}</h5>





      <div className="remodel-div2">

        <div className="remodel-col1">
          <p className="">
            <span className="">Date added</span>
          </p>
        </div>


        <div className="remodel-col1">
          <p className="">
           {date}
          </p>
        </div>

      </div>



      <div className="remodel-div2">

        <div className="remodel-col1">
          <p className="">
            <span className="">Date added</span>
          </p>
        </div>


        <div className="remodel-col1">
          <p className="">
          {place}
          </p>
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