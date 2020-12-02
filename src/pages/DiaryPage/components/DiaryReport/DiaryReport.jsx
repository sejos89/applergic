import './DiaryReport.scss';
import { useContext } from 'react';
import { AuthContext } from '../../../../shared/context/AuthContext';
import html2pdf from 'html2pdf.js';
import moment from 'moment';
import 'moment/locale/es';
import { Link } from 'react-router-dom';
import { displayWords } from '../../../../shared/blocks/displayWords';
import { DiaryContext } from '../../../../shared/context/DiaryContext';

export default function DiaryReport() {
  const { user } = useContext(AuthContext);
  const { diaryFood, setStep } = useContext(DiaryContext);

  let result = 0;
  let matches_allergens = [];
  const showScanResult = (item, user_allergens) => {
    if (!user_allergens || user_allergens.length === 0) {
      return;
    }
    matches_allergens = item.filter((element) => user_allergens.includes(element));

    if (matches_allergens.length === 0) {
      result = 1;
    } else {
      result = 2;
    }
  };

  const generatePDF = () => {
    // Choose the element that our invoice is rendered in.
    const element = document.getElementById('save-to-pdf');
    let date = moment(diaryFood[0].date).format('DD-MM-YYYY');

    let opt = {
      margin: 0.6,
      filename: `report-${date}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        useCORS: true,
        scale: 2,
        scrollX: 0,
        scrollY: 0,
        width: 660, //cuanto más grande mejor WTF...
      },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
      pagebreak: { mode: 'avoid-all' },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="d-flex flex-column justify-content-center mx-3">
      <div className="d-flex justify-content-between mb-2">
        <p className="b-text-btn d-flex align-items-center m-0" onClick={() => setStep(1)}>
          <span className="b-icon-aqua icon-left-arrow mr-2"></span>Volver
        </p>
        <Link to="/home" style={{ textDecoration: 'none' }}>
          <button className="icon-letter-x b-icon b-btn-icon ml-1"></button>
        </Link>
      </div>
      <div id="save-to-pdf">
        <p className="b-text-content-semibold-black-21px px-4 my-1">
          Este es el informe basado en tu Diario:
        </p>
        <p className="b-text-content-regular-grey-15px px-1">
          Actividad del{' '}
          <span style={{ fontWeight: '500' }}>
            {moment(diaryFood[0].date).locale('es').format('LL')}
          </span>
          .
        </p>
        <p className="b-text-content-regular-titleBlack-14px px-2 my-1">Nombre: {user.name}.</p>
        <p className="b-text-content-regular-warmPink-14px px-2 my-1">
          Alérgico a: <span style={{ fontWeight: '500' }}>{displayWords(user.allergens)}</span>.
        </p>
        <div className="px-2">
          {diaryFood?.map((item, index) => (
            <div className="report-container" key={index}>
              {showScanResult(item.food.allergens, user.allergens)}
              <div className="row mt-3" key={item}>
                <div className="col-4 d-flex align-items-center justify-content-center m-0">
                  <figure
                    className={`diary-favorite-image-container d-flex align-items-center justify-content-center ${
                      result === 1
                        ? 'diary-favorite-image-container--check'
                        : result === 2
                        ? 'diary-favorite-image-container--remove'
                        : ''
                    }`}
                  >
                    {result === 2 ? (
                      <span className="icon-remove b-icon-diary-result-negative">
                        <span className="path1"></span>
                        <span className="path2"></span>
                      </span>
                    ) : result === 1 ? (
                      <span className="icon-check b-icon-diary-result-positive">
                        <span className="path1"></span>
                        <span className="path2"></span>
                      </span>
                    ) : (
                      <span className="icon-question b-icon-diary-result-question">
                        <span className="path1"></span>
                        <span className="path2"></span>
                        <span className="path3"></span>
                      </span>
                    )}
                    <img
                      className="diary-favorite-image"
                      src={item.food.picture}
                      alt={item.food.name}
                    />
                  </figure>
                </div>
                <div className="col-8 d-flex flex-column px-0 pt-1">
                  <p className="b-text-content-grey-12px mb-1 mt-0">
                    {moment(item.date).format('DD/MM/YYYY HH:mm')}
                  </p>
                  <p className="b-text-content-grey-12px mb-1 mt-0">{item.food.name}</p>
                  <div className="b-text-content-regular-grey-12px my-0"> Notas: {item.notes}</div>
                </div>
              </div>
              <p className="b-text-content-regular-grey-12px my-2 mx-1">
                <span style={{ fontWeight: '500' }}>Ingredientes</span>:{' '}
                {displayWords(item.food.ingredients)}
              </p>
            </div>
          ))}
        </div>
      </div>
      <button className="b-btn b-btn mt-2 mb-3" onClick={() => generatePDF()}>
        Guardar en PDF
      </button>
    </div>
  );
}
