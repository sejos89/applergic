import { Link, useHistory } from 'react-router-dom';
import DiaryGallery from './components/DiaryGallery/DiaryGallery';
import DiaryReport from './components/DiaryReport/DiaryReport';

import './DiaryPage.scss';

import { Fragment, useMemo, useState } from 'react';
import { DiaryContext } from '../../shared/context/DiaryContext';

const showStep = (step) => {
  switch (step) {
    case 1:
      return <DiaryGallery />;
    case 2:
      return <DiaryReport />;
    default:
      return <Fragment />;
  }
};

export default function DiaryPage() {
  const [step, setStep] = useState(1);
  const [diaryFood, setDiaryFood] = useState([]);

  return (
    <div className="d-flex flex-column justify-content-center pt-4">
      <DiaryContext.Provider value={{ diaryFood, setDiaryFood, step, setStep }}>
        {useMemo(() => showStep(step), [step])}
      </DiaryContext.Provider>
    </div>
  );
}
