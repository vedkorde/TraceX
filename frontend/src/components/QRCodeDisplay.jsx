import { QRCodeSVG } from "qrcode.react";

export default function QRCodeDisplay({ productId }) {
  const url = `${window.location.origin}/verify/${productId}`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert("Verification link copied.");
    } catch {
      window.prompt("Copy this verification link:", url);
    }
  };

  return (
    <div className="qr-panel">
      <div className="qr-frame"><QRCodeSVG value={url} size={190} bgColor="#ffffff" fgColor="#07111f" includeMargin /></div>
      <div className="qr-info">
        <span className="tiny-label">VERIFICATION LINK</span>
        <code>{url}</code>
        <button className="secondary-btn full" onClick={copy}>Copy verification link</button>
      </div>
    </div>
  );
}