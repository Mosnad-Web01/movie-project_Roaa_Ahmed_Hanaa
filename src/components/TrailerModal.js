// src/components/TrailerModal.js
"use client";
import React from 'react';
import Modal from 'react-modal';

const TrailerModal = ({ isOpen, closeModal, selectedTrailer }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Trailer"
      className="bg-gray-800 p-4 rounded-md w-full max-w-2xl mx-auto my-20"
      overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
    >
      {selectedTrailer && (
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4 text-white">{selectedTrailer.title || selectedTrailer.name}</h2>
          <iframe
            width="100%"
            height="300"
            src={`https://www.youtube.com/embed/${selectedTrailer.key}`}
            title={selectedTrailer.title || selectedTrailer.name}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <button onClick={closeModal} className="mt-4 px-4 py-2 bg-red-500 text-white rounded text-sm">
            Close
          </button>
        </div>
      )}
    </Modal>
  );
};

export default TrailerModal;
