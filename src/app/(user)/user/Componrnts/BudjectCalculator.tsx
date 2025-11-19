"use client";
import React from "react";

const BudjectCalculator = ({ project }: any) => {
  // Extract values from project
  const buildArea = project?.build_area ?? 0;
  const costFinish = project?.cost_finsh ?? 0;
  const suggestCost = project?.suggest_cost ?? 0;
  const totalCost = project?.total_cost ?? 0;

  // Fee Rate from luxury level details (optional)
  const feeRate = project?.luxury_level_details?.rate ?? null;

  return (
    <div className="budget-calc">
      <h2>Budget Calculator</h2>

      <div className="budget-calculator">

        {/* LEFT COLUMN */}
        <div className="bud-col1">
          <div className="bud-row">
            <p><strong>Total max buildable area</strong></p>
            <p><span>{buildArea.toLocaleString()}</span></p>
          </div>

          <div className="bud-row">
            <p><strong>Cost with finish</strong></p>
            <p><span>{costFinish.toLocaleString()}</span></p>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="bud-col1 bud-col2">
          <div className="bud-row">
            <p><strong>Design Fee Cost</strong></p>
            <p>
              <span className="cost-value">{suggestCost.toLocaleString()}</span>
              {feeRate !== null && ` (${feeRate}%)`}
            </p>
          </div>

          <div className="bud-row">
            <p><strong>Total Project Cost</strong></p>
            <p><span>{totalCost.toLocaleString()}</span></p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BudjectCalculator;
