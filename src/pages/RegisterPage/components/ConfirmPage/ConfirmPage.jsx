import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { createUser } from '../../../../shared/services/user';
import { FormContext } from '../../context/FormContext';
import Loader from 'react-loader-spinner';
import { AuthContext } from '../../../../shared/context/AuthContext';

export default function ConfirmPage() {
  const { setUser } = useContext(AuthContext);
  const { infoForm, setInfoForm, step, setStep } = useContext(FormContext);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit } = useForm({});

  const onSubmit = (data) => {
    const dataArr = Object.values(data).filter((values) => values);
    const payload = {
      ...infoForm,
      form3: { allergens: dataArr },
    };

    const formData = new FormData();
    Object.keys(payload).forEach((key) => {
      if (typeof payload[key] !== 'undefined') {
        formData.append(key, JSON.stringify(payload[key]));
      }
    });
    formData.append('image', payload.form1.image[0]);
    formData.append('email', payload.form1.email);
    formData.append('password', payload.form1.password);

    setLoading(true);
    createUser(formData)
      .then((data) => {
        setInfoForm({
          form1: {},
          form2: {},
          form3: { allergens: [], allergens_raw: {} },
        });
        setStep(step + 1);
        setUser(data.data.data);
      })
      .catch((error) => {
      })
      .finally(() => setLoading(true));
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <Loader type="Puff" color="#00BFFF" height={100} width={100} timeout={3000} />
      </div>
    );
  }

  return (
    <div className="mx-4 mt-4">
      <div className="d-flex justify-content-end">
        <p onClick={() => setStep(step - 1)} className="b-text-btn d-flex align-items-center m-0">
          <span className="b-icon icon-letter-x"></span>
        </p>
      </div>
      <p className="b-text-content-semibold-black-21px mt-4">Confirma tu selección.</p>
      <p className="b-text-content-regular-grey-15px mt-5">
        A continuación te resumimos los alimentos registrados como peligrosos para ti.
      </p>
      <p className="b-text-content-medium-grey-15px">Marca para seleccionar o añadir uno nuevo.</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <>
          <div className="allergen-value-container">
            {Object.entries(infoForm.form3.allergens_raw)
              .filter(([key, values]) => values)
              .map((x) => (
                <label className="allergen-value-label">
                  <input
                    className="allergen-value-input"
                    type="checkbox"
                    name={x[0]}
                    value={x[1]}
                    defaultChecked={true}
                    ref={register}
                  />
                  <span className="allergen-value-span b-text-content-bold-aqua-16px b-text-content-bold-aqua-16px--grey">
                    {x[0]}
                  </span>
                </label>
              ))}
            <button
              className="allergen-value-span b-text-content-bold-aqua-16px b-text-content-bold-aqua-16px--grey"
              onClick={() => setStep(step - 1)}
            >
              Añadir nuevos
            </button>
          </div>
        </>
        <button className="b-btn b-btn my-5">CONFIRMAR</button>
      </form>
    </div>
  );
}
