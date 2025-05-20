import { Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import { useState } from "react";
import Button from "../button/Button";

export default function FieldModal({
  title = "open",
  children,
  handleAddField,
}) {
  const [openModal, setOpenModal] = useState(false);

  const handleConfirm = () => {
    const result = handleAddField();
    
    if (result && result.errors) {
      return;
    }
    setOpenModal(false);
  };

  return (
    <>
      <Button
        onClick={() => setOpenModal(true)}
        label={title}
        variant="success"
      />

      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <ModalHeader className="px-4">Select Field type</ModalHeader>
        <ModalBody className="max-w-2xl">{children}</ModalBody>
        <ModalFooter className="space-x-2">
          <Button onClick={handleConfirm} label="Confirm" variant="success" />
          <Button
            color="gray"
            onClick={() => setOpenModal(false)}
            label="Close"
            variant="danger"
          />
        </ModalFooter>
      </Modal>
    </>
  );
}
