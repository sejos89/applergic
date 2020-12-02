import { Fragment, useState, useMemo } from 'react';
import ScanGallery from './components/ScanGallery/ScanGallery';
import ScanSearch from './components/ScanSearch/ScanSearch';
import { ScanContext } from './components/context/ScanContext';

import './ScanPage.scss';

const showStep = (step) => {
  switch (step) {
    case 1:
      return <ScanSearch />;
    case 2:
      return <ScanGallery />;
    default:
      return <Fragment />;
  }
};

export default function ScanPage() {
  const [step, setStep] = useState(1);
  const [item, setItem] = useState({});
  const [result, setResult] = useState(0);

  return (
    <>
      <ScanContext.Provider value={{ item, setItem, step, setStep, result, setResult }}>
        {useMemo(() => showStep(step), [step])}
      </ScanContext.Provider>
    </>
  );
}
