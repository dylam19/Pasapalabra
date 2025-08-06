// src/components/Modal.jsx
import React from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ show, onClose, children }) => {
  if (!show) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-lg relative">

        {/* Contenido del modal */}
        <div className="text-gray-800">
          {children}
        </div>

        {/* Botón Cancelar */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition"
          >
            CANCELAR
          </button>
        </div>

      </div>
    </div>,
    document.getElementById('modal-root') // Asegurate de tener un div con id="modal-root" en tu HTML
  );
};

export default Modal;
