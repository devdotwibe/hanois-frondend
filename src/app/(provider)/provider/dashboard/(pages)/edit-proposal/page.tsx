"use client";

import { useSearchParams } from "next/navigation";
import EditProposalIntro from "../../Components/EditProposalIntro";

const Page = () => {
  const params = useSearchParams();
  const proposal_id = params.get("id");

  return (
    <div className="edit-proposalpage">
      <EditProposalIntro proposal_id={proposal_id} />
    </div>
  );
};

export default Page;
