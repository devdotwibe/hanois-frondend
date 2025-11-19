"use client";

import React from 'react';
import { useSearchParams } from "next/navigation";
import SendProposalIntro from '../../Components/SendProposalIntro';

const SendProposal = () => {
  const params = useSearchParams();
const work_id = params.get("work_id");
const user_id = params.get("user_id");
const provider_id = params.get("provider_id");


  return (
    <div className="send-proposal">
    <SendProposalIntro work_id={work_id} user_id={user_id} provider_id={provider_id} />

    </div>
  );
};

export default SendProposal;
