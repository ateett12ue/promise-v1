import React, { useState } from "react";
import { Button, Icon, Modal } from "web3uikit";

type Props = {};

const LaunchToken = ({}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <Button
        icon="plus"
        id="test-button-primary-icon"
        onClick={() => setIsOpen(true)}
        text="Launch Tokens"
        theme="primary"
        type="button"
      />
      <Modal
        cancelText="oh nevermind, we will launch token later"
        id="regular"
        closeButton={<div />}
        isVisible={isOpen}
        okText="let's go we are launching our token"
        onCancel={handleClose}
        onCloseButtonPressed={handleClose}
        onOk={function noRefCheck() {}}
        title="Launch Tokens"
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
          <p>Proceed to launch?</p>
        </div>
      </Modal>
    </>
  );
};

export default LaunchToken;
