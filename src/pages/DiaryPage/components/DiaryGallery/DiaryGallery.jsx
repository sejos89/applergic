import './DiaryGallery.scss';
import { useContext, useEffect, useState } from 'react';
import { deleteDiary, editNotesDiary, getDiary } from '../../../../shared/services/user';
import { AuthContext } from '../../../../shared/context/AuthContext';
import { useForm } from 'react-hook-form';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import moment from 'moment';
import { Link } from 'react-router-dom';
import { DiaryContext } from '../../../../shared/context/DiaryContext';

export default function DiaryGallery() {
  const { user, setUser } = useContext(AuthContext);
  const { diaryFood, setDiaryFood, step, setStep } = useContext(DiaryContext);

  const [formEnabled, setFormEnabled] = useState([]);
  const [diaryEmpty, setDiaryEmpty] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  let today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const { handleSubmit, register } = useForm();

  let result = 0;
  let matches_allergens = [];

  const showScanResult = (item, user_allergensObj) => {
    const user_allergens = user_allergensObj.map((allergen) => allergen._id);

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

  const enableNotesForm = (indexItem) => {
    let newArray = [];
    formEnabled.forEach((item, index) => {
      if (index === indexItem) {
        newArray.push(!item);
      } else {
        newArray.push(true);
      }
    });
    setFormEnabled(newArray);
  };

  useEffect(() => {
    getDiary(selectedDate).then((data) => {
      let user_diary = [];
      if (!!data.data) {
        user_diary = data.data.diary.sort((a, b) => new Date(b.date) - new Date(a.date));
        setDiaryEmpty(false);
      } else setDiaryEmpty(true);
      setDiaryFood(user_diary);
      const arrayOfTrues = new Array(user_diary.length).fill(true);
      setFormEnabled(arrayOfTrues);
    });
  }, [user, selectedDate]);

  const onSubmit = (data) => {
    const filteredData = Object.entries(data).filter(([keys, values]) => values !== undefined);
    const noteObj = { diary_id: filteredData[0][0], note_value: filteredData[0][1] };

    editNotesDiary(noteObj).then((data) => {
      setUser(data.data);
    });
  };

  return (
    <>
      <div className="mx-3 d-flex justify-content-end mb-2">
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="icon-calendar b-icon b-btn-icon"
        ></button>
        {showCalendar && (
          <Calendar
            className="calendar-container"
            defaultValue={selectedDate}
            onClickDay={(value) => {
              setSelectedDate(value);
              setShowCalendar(!showCalendar);
            }}
          ></Calendar>
        )}
        {/* <Link to="/home" style={{ textDecoration: 'none' }}>
          <button className="icon-settings b-icon b-btn-icon ml-1"></button>
        </Link> */}
        <Link to="/home" style={{ textDecoration: 'none' }}>
          <button className="icon-letter-x b-icon b-btn-icon ml-1"></button>
        </Link>
      </div>
      <p className="b-text-content-semibold-black-21px px-5 my-1">
        Estos son los alimentos de tu Diario:
      </p>
      {!diaryEmpty && (
        <p className="b-text-content-regular-grey-15px px-5">
          Añade tus comentarios para completar tu información.
        </p>
      )}
      {diaryEmpty && (
        <p className="b-text-content-regular-grey-15px px-5">
          Tu diario está vacío para la fecha seleccionada.
        </p>
      )}
      <div className="p-2">
        {diaryFood?.map((item, index) => (
          <div key={item._id}>
            {showScanResult(item.food.allergens, user.allergens)}
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
                  <img
                    className="diary-favorite-image"
                    src={item.food.picture}
                    alt={item.food.name}
                  />
                </figure>
              </div>
              <div className="col-6 d-flex flex-column px-0 pt-1">
                <p className="b-text-content-black-12px mb-1 mt-0">
                  {moment(item.date).format('DD/MM/YYYY HH:mm')}
                </p>
                <p className="b-text-content-black-12px mb-1 mt-0">{item.food.name}</p>
                <div className="b-text-content-regular-grey-12px my-0">
                  {' '}
                  Notas:
                  <form onSubmit={handleSubmit(onSubmit)} className="d-flex">
                    <label htmlFor="notes"></label>
                    <textarea
                      className="notes-form-input"
                      name={item._id}
                      id="notes"
                      ref={register}
                      defaultValue={item.notes}
                      maxLength="100"
                      disabled={formEnabled[index]}
                    />
                    {!formEnabled[index] && (
                      <button className="notes-form-submit pr-0">
                        <span className="icon-check b-icon b-icon--2rem">
                          <span className="path1"></span>
                          <span className="path2"></span>
                        </span>
                      </button>
                    )}
                  </form>
                </div>
              </div>
              <div className="col-2 d-flex flex-column justify-content-between">
                <button
                  onClick={() => {
                    const food_id = { id: item._id };
                    deleteDiary(food_id).then((data) => {
                      setUser(data.data);
                    });
                  }}
                  className="icon-letter-x b-icon b-btn-icon"
                ></button>
                <button
                  onClick={() => {
                    enableNotesForm(index);
                  }}
                  className="icon-pen b-icon b-btn-icon pb-1"
                ></button>
              </div>
            </div>
          </div>
        ))}
        <div className="mx-3">
          {!diaryEmpty && (
            <button
              className="b-btn b-btn mt-2 mb-3"
              onClick={() => diaryFood.length && setStep(2)}
            >
              Generar informe
            </button>
          )}
        </div>
      </div>
    </>
  );
}
