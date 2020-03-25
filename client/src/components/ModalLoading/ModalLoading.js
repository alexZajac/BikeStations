import React from "react";
import "./ModalLoading.css";

import Modal from "react-modal";
import Lottie from "react-lottie";
import animationData from "../../assets/loading_anim.json";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "column",
    borderRadius: "20px"
  },
  overlay: {
    zIndex: 2
  }
};

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
};

const ModalLoading = ({ refreshData }) => {
  return (
    <Modal isOpen={refreshData} style={customStyles}>
      <div className="lottie-container">
        <Lottie
          options={defaultOptions}
          height={400}
          width={400}
          isStopped={false}
          isPaused={false}
        />
      </div>
      <p className="modal-text">Let's find all these bike stations! 🚴‍♂️</p>
    </Modal>
  );
};

export default ModalLoading;
