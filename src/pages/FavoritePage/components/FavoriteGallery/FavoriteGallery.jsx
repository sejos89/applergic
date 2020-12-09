import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { displayWords } from '../../../../shared/blocks/displayWords';
import { AuthContext } from '../../../../shared/context/AuthContext';
import {
  addDiary,
  deleteDiary,
  deleteFavorite,
  getFavorites,
} from '../../../../shared/services/user';
import './FavoriteGallery.scss';

export default function FavoriteGallery() {
  const { user, setUser } = useContext(AuthContext);
  const [favoriteFood, setFavoriteFood] = useState([]);
  const [isAddedDiary, setIsAddedDiary] = useState([]);
  const [isAddedDiaryId, setIsAddedDiaryId] = useState([]);
  const [favoriteEmpty, setFavoriteEmpty] = useState(false);

  let result = 0;
  let matches_allergens = [];

  const showScanResult = (item, user_allergensObj) => {
    const user_allergens = user_allergensObj.map((allergen) => allergen._id);

    if (!user_allergens || user_allergens.length === 0) {
      return;
    }

    if (typeof item[0] === 'string') {
      matches_allergens = item.filter((element) => user_allergens.includes(element));
    } else {
      matches_allergens = item.filter((element) => user_allergens.includes(element._id));
    }

    if (matches_allergens.length === 0) {
      result = 1;
    } else {
      result = 2;
    }
  };

  const enableAddDiary = (indexItem, diaryId) => {
    let newArray = [];
    let newArrayId = [];

    isAddedDiary.forEach((item, index) => {
      if (index === indexItem) {
        newArray.push(!item);
        if (isAddedDiaryId[index] === '') {
          newArrayId.push(diaryId);
        } else {
          newArrayId.push('');
        }
      } else if (item === true) {
        newArray.push(true);
        newArrayId.push(isAddedDiaryId[index]);
      } else {
        newArray.push(false);
        newArrayId.push('');
      }
    });
    setIsAddedDiary(newArray);
    setIsAddedDiaryId(newArrayId);
  };

  useEffect(() => {
    getFavorites().then((data) => {
      if (!!data.data.favorites.length) {
        setFavoriteEmpty(false);
      } else setFavoriteEmpty(true);

      const user_favorite = data.data.favorites;
      setFavoriteFood(user_favorite);
      const arrayOfTrues = new Array(user_favorite.length).fill(false);
      const arrayOfEmptyStrings = new Array(user_favorite.length).fill('');
      setIsAddedDiary(arrayOfTrues);
      setIsAddedDiaryId(arrayOfEmptyStrings);
    });
  }, []);

  useEffect(() => {
    getFavorites().then((data) => {
      const user_favorite = data.data.favorites;
      setFavoriteFood(user_favorite);
    });
  }, [user]);

  return (
    <div className="p-2">
      {favoriteEmpty && (
        <>
          <p className="b-text-content-regular-grey-15px px-5">
            ¿Aún no tienes alimentos favoritos?
          </p>
          <Link to="/scan" style={{ textDecoration: 'none' }}>
            <button className="b-btn b-btn mt-2">Escanea un producto</button>
          </Link>
        </>
      )}
      {favoriteFood.map((item, index) => (
        <div key={item._id}>
          {showScanResult(item.allergens, user.allergens)}
          <div
            className={`row diary-favorite-container pt-2 pb-3 ${
              result === 1
                ? 'diary-favorite-container--check'
                : result === 2
                ? 'diary-favorite-container--remove'
                : ''
            }`}
          >
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
                <img className="diary-favorite-image" src={item.picture} alt={item.name} />
              </figure>
            </div>
            <div className="col-6 d-flex flex-column px-0 pt-1">
              {/* <p className="b-text-content-black-12px mb-1 mt-0">
                {moment(item.date).format('DD/MM/YYYY HH:mm')}
              </p> */}
              <p className="b-text-content-black-12px my-0">{item.name}</p>
              <p className="b-text-content-regular-grey-12px mb-0">
                <b>Ingredientes: </b>
                {displayWords(item.ingredients)}
              </p>
              <p className="b-text-content-regular-grey-12px mb-0">
                <b>Alérgenos : </b>
                {displayWords(item.allergens)}
              </p>
              <div className="b-text-content-regular-grey-12px my-0"></div>
            </div>
            <div className="col-2 d-flex flex-column justify-content-between">
              <button
                onClick={() => {
                  const food_id = { favorite: item._id };
                  deleteFavorite(food_id).then((data) => {
                    setUser(data.data);
                  });
                }}
                className="icon-letter-x b-icon b-icon--remove-item b-btn-icon"
              ></button>
              <span
                onClick={() => {
                  let food_id = { id: item._id };

                  if (isAddedDiary[index]) {
                    let diary_id = { id: isAddedDiaryId[index] };
                    deleteDiary(diary_id).then((data) => {
                      setUser(data.data);
                      enableAddDiary(index, '');
                    });
                  } else {
                    addDiary(food_id).then((data) => {
                      setUser(data.data);
                      const lastItemDiary = data.data.diary[data.data.diary.length - 1]._id;
                      enableAddDiary(index, lastItemDiary);
                    });
                  }
                }}
                className={`icon-notebook ${
                  isAddedDiary[index] ? 'b-icon-aqua b-icon-aqua--L' : 'b-icon b-icon--4rem'
                } `}
              ></span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
