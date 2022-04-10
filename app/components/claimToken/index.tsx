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
        text="Claim DAO Tokens"
        theme="primary"
        type="button"
      />
      <Modal
        cancelText="oh nevermind, I will claim later"
        id="regular"
        closeButton={<div />}
        isVisible={isOpen}
        okText="let's go we are claiming our DAO tokens"
        onCancel={handleClose}
        onCloseButtonPressed={handleClose}
        onOk={function noRefCheck() {}}
        title="Claim"
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Icon fill="#112F5C" size={64} svg="dapps" />
          <p>Proceed to claim?</p>
        </div>
      </Modal>
    </>
  );
};

export default BurnToken;
