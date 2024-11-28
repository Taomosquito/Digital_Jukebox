import React from 'react';
import ReactQRCode from 'react-qr-code';
import "../.././styles/QRCodeGenerator.scss";

const QRCodeGenerator: React.FC = () => {
  const url = 'http://localhost:5173/playlist';

  return (
    <div className='qrcode'>
      <p>Scan this QR Code to visit the Playlist</p>
      <span className='qrcode__image'>
        <ReactQRCode value={url} size={300}/>
      </span>
    </div>
  );
};

export default QRCodeGenerator;
