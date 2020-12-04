import './ScanSearch.scss';

import { useContext, useEffect, useState } from 'react';
import QrReader from 'react-qr-scanner';
import { Link } from 'react-router-dom';
import { ScanContext } from '../context/ScanContext';
import { getFood } from '../../../../shared/services/food';

export default function ScanPage() {
  const { setItem, setStep } = useContext(ScanContext);

  const [scan, setScan] = useState({ delay: 100, result: 'No result', facingMode: 'rear' });

  const handleScan = (data) => data && setScan({ result: data });

  useEffect(() => {
    getFood(scan.result)
      .then((res) => {
        setItem(res.data);
        setStep(2);
      })
      .catch((error) => console.log(error));
  }, [scan]);

  const handleError = (err) => console.error(err);

  const previewStyle = { width: 255, height: 255 };

  const cameraButton = () =>
    scan.facingMode === 'rear' ? setScan({ facingMode: 'front' }) : setScan({ facingMode: 'rear' });

  return (
    <div className="pt-4">
      <div className="d-flex justify-content-end mx-3">
        <Link to="/home" style={{ textDecoration: 'none' }}>
          <span className="icon-letter-x b-icon"></span>
        </Link>
      </div>
      <div className="mx-4 d-flex flex-column justify-content-center">
        <p className="mb-5 b-text-content-semibold-black-21px p-scansearch-scanning">
          Escaneando...
        </p>
        <p className="mb-4 b-text-content-regular-grey-15px">
          Tan solo tienes que centrar el código <b>QR</b> del producto en el reacuadro.
        </p>
        <div className="mb-3" style={{ margin: '0 auto' }}>
          <QrReader
            className="qr-reader"
            delay={scan.delay}
            onError={handleError}
            onScan={handleScan}
            style={previewStyle}
            facingMode={scan.facingMode}
          />
        </div>
        <p>{scan.result}</p>
        <button className="b-btn b-btn--disabled" onClick={cameraButton}>
          Cambiar cámara
        </button>
      </div>
    </div>
  );
}
