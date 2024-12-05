import React from 'react';
import ReactQRCode from 'react-qr-code';
import "../.././styles/QRCodeGenerator.scss";

const QRCodeGenerator: React.FC = () => {
  const url = 'http://localhost:5173/playlist';

  return (
    <div className='qrcode__modal-overlay'>
      <div className='qrcode__modal-content'>
        <p>Digital JukeBox</p>
        <p>Welcome! Scan this QR Code to visit the Playlist</p>
        <span className='qrcode__image'>
          <ReactQRCode value={url} size={300}/>
        </span>
      </div>

    </div>
  );
};

export default QRCodeGenerator;
