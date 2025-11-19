"use client";

import { useSearchParams } from "next/navigation";
import ViewProposalIntro from "../../Components/ViewProposalIntro";

const Page = () => {
  const params = useSearchParams();
  const proposal_id = params.get("id");

  return (
    <div className="edit-proposalpage">
      <ViewProposalIntro proposal_id={proposal_id} />
    </div>
  );
};

export default Page;
