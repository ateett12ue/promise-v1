import React, { useState } from "react";
import LaunchToken from "../launchToken";
import FundContributor from "../fundContributor";
import BurnToken from "../burnToken";
import ClaimToken from "../claimToken";
import Leaderboard from "../leaderboard";
import { Widget, Avatar, Tag, Icon, Table, Button, Modal } from "web3uikit";

type Props = {
  member: any;
};

const Dashboard = ({ member }: Props) => {
  return (
    <div className="px-4 py-3">
      <section style={{ display: "flex", gap: "20px" }}>
        <Widget info="Promise DAO" title="DAO NAME" />
        <Widget info="500,000" title="DAO TOKEN SUPPLY"></Widget>
        <Widget info="Promise (PRO)" title="COLLATERAL TOKEN"></Widget>
        <Widget info="233,000" title="TREASURY BALANCE"></Widget>
      </section>

      <section style={{ display: "flex", gap: "20px" }} className="py-3">
        {/* The tables for list of treasury managers, contributors, and funders */}
      </section>

      <section style={{ display: "flex", gap: "20px" }} className="py-3">
        {/* Buttons for actions come here: Launch tokens, Fund contributors, manage roles */}
        <LaunchToken />
        <FundContributor />
        <Button
          icon="plus"
          id="test-button-primary-icon"
          onClick={function noRefCheck() {}}
          text="Manage roles"
          theme="secondary"
          type="button"
        />
        <BurnToken />
        <ClaimToken />
      </section>
      <Leaderboard />
    </div>
  );
};

export default Dashboard;
