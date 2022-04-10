import React, { useState } from "react";
import { Button, Icon, Input, Modal } from "web3uikit";

type Props = {};

const BurnToken = ({}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <Button
        icon="plus"
        id="test-button-primary-icon"
        onClick={() => setIsOpen(true)}
        text="Burn Promise Tokens"
        theme="secondary"
        type="button"
      />
      <Modal
        cancelText="oh nevermind, i rather keep them"
        id="regular"
        closeButton={<div />}
        isVisible={isOpen}
        okText="yeah I think I want my collateral"
        onCancel={handleClose}
        onCloseButtonPressed={handleClose}
        onOk={function noRefCheck() {}}
        title="Burn"
      >
        <div className="mb-4">
          <Input
            label="Amount"
            onChange={function noRefCheck() {}}
            type="number"
          />
        </div>
      </Modal>
    </>
  );
};

export default BurnToken;
