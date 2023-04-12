import {useEffect, useState} from "react";
import QRCode from 'qrcode';

export const useQrCode = (url: string) => {
  const [qrCode, setQrCode] = useState<string>('');
  useEffect(() => {
    QRCode.toDataURL(url, function (err, string) {
      if (err) throw err;
      setQrCode(string);
    });
  }, []);

  return [qrCode];
};