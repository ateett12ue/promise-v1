import React, { useState } from "react";
import { Button, Icon, Input, Modal } from "web3uikit";

type Props = {};

const FundContributor = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  return (
    <>
      <Button
        icon="plus"
        id="test-button-primary-icon"
        onClick={() => setIsOpen(true)}
        text="Fund Contributor"
        theme="secondary"
        type="button"
      />
      <Modal
        cancelText="cancel"
        id="regular"
        closeButton={<div />}
        isVisible={isOpen}
        okText="yes let's give him the tokens"
        onCancel={handleClose}
        onOk={function noRefCheck() {}}
        title="Fund Contributor"
      >
        {/* <div
          style={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Icon fill="#112F5C" size={64} svg="usdc" />
          <p>Proceed to launch?</p>
        </div> */}
        <div className="mb-4">
          <Input
            label="Amount"
            onChange={function noRefCheck() {}}
            type="number"
          />
        </div>
        <Input
          label="Address"
          onChange={function noRefCheck() {}}
          type="text"
        />
      </Modal>
    </>
  );
};

export default FundContributor;
