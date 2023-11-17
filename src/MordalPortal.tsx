import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';

interface ModalPortalProps {
  children: ReactNode;
}

const ModalPortal: React.FC<ModalPortalProps> = ({ children }) => {
  const el = document.getElementById('modal');
  if (!el) {
    throw new Error('Element with id "modal" not found in the document');
  }

  return ReactDOM.createPortal(children, el);
};

export default ModalPortal;
