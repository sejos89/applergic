import './ScanGallery.scss';

import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ScanContext } from '../context/ScanContext';
import { displayWords } from '../../../../shared/blocks/displayWords';
import { AuthContext } from '../../../../shared/context/AuthContext';
import {
  addDiary,
  deleteDiary,
  addFavorite,
  deleteFavorite,
} from '../../../../shared/services/user';

export default function ScanGallery() {
  const { item, step, setStep, result, setResult } = useContext(ScanContext);
  const { user, setUser } = useContext(AuthContext);
  const [isAddedDiary, setIsAddedDiary] = useState(false);
  const [isAddedFavorite, setIsAddedFavorite] = useState(false);

  useEffect(() => {
    if (user.favorites.includes(item._id)) {
      setIsAddedFavorite(true);
    }
  }, []);

  let matches_allergens = [];

  const showScanResult = (item, user_allergensObj) => {
    const user_allergens = user_allergensObj.map((allergen) => allergen._id);

    if (!user_allergens || user_allergens.length === 0) {
      return;
    }
    matches_allergens = item.filter((element) =>
      user_allergens.find((e) => {
        return e.includes(element._id);
      }),
    );
    if (matches_allergens.length === 0) {
      setResult(1);
    } else {
      setResult(2);
    }
  };

  showScanResult(item.allergens, user.allergens);

  return (
    <div className="mx-3 pt-4">
      <div className="d-flex justify-content-between mb-2">
        <p className="b-text-btn d-flex align-items-center m-0" onClick={() => setStep(step - 1)}>
          <span className="b-icon-aqua icon-left-arrow mr-2"></span>Volver
        </p>
        <Link to="/home" style={{ textDecoration: 'none' }}>
          <span className="icon-letter-x b-icon"></span>
        </Link>
      </div>
      <p className="b-text-content-semibold-black-21px scanGallery-title">
        Aqui tienes el resultado.
      </p>
      <p className="b-text-content-regular-grey-15px">
        {result === 1
          ? 'Este producto es apto para ti.'
          : result === 2
          ? `Este producto NO es apto para ti, contiene: ${displayWords(matches_allergens)}`
          : 'Lo sentimos, no hay datos suficientes para poder valor este producto'}
      </p>
      <div className="d-flex flex-row-reverse justify-content-start mx-0">
        <div className="d-flex flex-column justify-content-around py-3">
          <span
            onClick={() => {
              let food_id = { favorite: item._id };

              if (isAddedFavorite) {
                deleteFavorite(food_id).then((data) => {
                  setUser(data.data);
                  setIsAddedFavorite(false);
                });
              } else {
                addFavorite(food_id).then((data) => {
                  setUser(data.data);
                  setIsAddedFavorite(true);
                });
              }
            }}
            className={`icon-star-empty ${
              isAddedFavorite ? 'b-icon-aqua b-icon-aqua--L' : 'b-icon b-icon--4rem'
            } `}
          ></span>
          <span
            onClick={() => {
              let food_id = { id: item._id };

              if (isAddedDiary) {
                const current_foodId = user.diary[user.diary.length - 1]._id;
                let food_id = { id: current_foodId };
                deleteDiary(food_id).then(() => setIsAddedDiary(false));
              } else {
                addDiary(food_id).then((data) => {
                  setUser(data.data);
                  setIsAddedDiary(true);
                });
              }
            }}
            className={`icon-notebook ${
              isAddedDiary ? 'b-icon-aqua b-icon-aqua--L' : 'b-icon b-icon--4rem'
            } `}
          ></span>
          {/* <span className="icon-share b-icon b-icon--4rem"></span> */}
        </div>
        <figure
          className={`scanGallery-image-container ${
            result === 1
              ? 'scanGallery-image-container--check'
              : result === 2
              ? 'scanGallery-image-container--remove'
              : ''
          }`}
        >
          {result === 2 ? (
            <span className="icon-remove b-icon-scan-result-negative">
              <span className="path1"></span>
              <span className="path2"></span>
            </span>
          ) : result === 1 ? (
            <span className="icon-check b-icon-scan-result-positive">
              <span className="path1"></span>
              <span className="path2"></span>
            </span>
          ) : (
            <span className="icon-question b-icon-scan-result-question">
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
            </span>
          )}
          <img className="scanGallery-image-result" src={item.picture} alt="" />
        </figure>
      </div>

      <p className="b-text-content-medium-grey-18px mt-3 mb-1">
        <b>{item.name}</b>
      </p>
      <p className="b-text-content-bold-aqua-16px b-text-content-bold-aqua-16px--grey my-1">
        {item.brand}
      </p>
      <p className="b-text-content-regular-grey-12px">
        <b>Ingredientes: </b>
        {displayWords(item.ingredients)}
      </p>
      <button className="b-btn my-4" onClick={() => setStep(step - 1)}>
        Escanea otro producto
      </button>
    </div>
  );
}
