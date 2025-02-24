import React from 'react';
import './Bonfire.scss';

const Bonfire = () => {
  return (
    <div className="fireplace">
      {/* Llamas de fuego */}
      <div className="flame"></div>
      <div className="flame small"></div>

      {/* Luz alrededor */}
      <div className="firelight"></div>

      {/* Chispas (puedes agregar más si quieres) */}
      <div className="spark"></div>
    </div>
  );
};

export default Bonfire;
