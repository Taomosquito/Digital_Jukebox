import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import ReactQRCode from 'react-qr-code';
import "../.././styles/QRCodeGenerator.scss";
const QRCodeGenerator = () => {
    const url = 'http://localhost:5173/playlist';
    return (_jsx("div", { className: 'qrcode__modal-overlay', children: _jsxs("div", { className: 'qrcode__modal-content', children: [_jsx("p", { children: "Digital JukeBox" }), _jsx("p", { children: "Welcome! Scan this QR Code to visit the Playlist" }), _jsx("span", { className: 'qrcode__image', children: _jsx(ReactQRCode, { value: url, size: 300 }) })] }) }));
};
export default QRCodeGenerator;
