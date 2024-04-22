"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalProps,
} from "@nextui-org/react";
import React from "react";

interface MProps extends ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: () => void;
  title: string;
}
const GlobalModal: React.FC<MProps> = ({
  children,
  isOpen,
  onOpenChange,
  title,
  ...props
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} {...props} radius="md">
      <ModalContent>
        <>
          <ModalHeader className="text-2xl">{title}</ModalHeader>
          <ModalBody className="scrollbar-hide">{children}</ModalBody>
        </>
      </ModalContent>
    </Modal>
  );
};

export default GlobalModal;
