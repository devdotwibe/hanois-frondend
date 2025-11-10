import React from "react";
import RemodelingCard from "./RemodelingCard";

const RemodellingDiv = () => {
  const remodelingData = [
    {
      id: 1,
      title: "Public",
      description: "Complete home remodeling",
      date: "10.08.2023",
      place: "New York",
      proposal: "34 proposals",
      className: "featured-card", 
    },
    {
      id: 2,
      title: "Public",
      description: "Complete home remodeling",
      date: "10.08.2023",
      place: "New York",
      proposal: "34 proposals",
      className: "featured-card", 
    },
    {
      id: 3,
      title: "Public",
      description: "Complete home remodeling",
      date: "10.08.2023",
      place: "New York",
      proposal: "34 proposals",
      className: "featured-card", 
    },
    
    {
      id: 4,
      title: "Public",
      description: "Complete home remodeling",
      date: "10.08.2023",
      place: "New York",
      proposal: "34 proposals",
      className: "featured-card-hilight", 
    },
    {
      id: 5,
      title: "Public",
      description: "Complete home remodeling",
      date: "10.08.2023",
      place: "New York",
      proposal: "34 proposals",
      className: "featured-card-hilight", 
    },
    
  ];

  return (
    <div className="remodeling-div">
      {remodelingData.map((item) => (
        <RemodelingCard
          key={item.id}
          title={item.title}
          description={item.description}
          date={item.date}
          place={item.place}
          proposal={item.proposal}
          className={item.className}
        />
      ))}
    </div>
  );
};

export default RemodellingDiv;
