import './FormPageThree.scss';
import FormThree from '../../../../shared/components/FormThree/FormThree';

import { useContext, useEffect, useState } from 'react';
import { FormContext } from '../../context/FormContext';
import { getAllergens } from '../../../../shared/services/allergens';
import { clusterAllergensByFirstLetter } from '../../../../shared/blocks/clusterAllergensByFirstLetter';
import { useForm } from 'react-hook-form';

export default function FormPageThree() {
  const { infoForm, setInfoForm, step, setStep } = useContext(FormContext);
  const [allergens, setAllergens] = useState(null);

  useEffect(() => {
    getAllergens().then((res) => {
      setAllergens(clusterAllergensByFirstLetter(res.data));
    });
  }, []);

  const { register, handleSubmit, getValues } = useForm({
    // mode: 'onChange', //Para que la validacion se haga caracter de cada input
    defaultValues: infoForm.form3.allergens_raw,
  });

  const onSubmit = (data) => {
    const dataArr = Object.values(data).filter((values) => values); // filtra los q son false
    setInfoForm({ ...infoForm, form3: { allergens: dataArr, allergens_raw: data } });
    setStep(step + 1);
  };

  return (
    <div className="mx-3 mt-4">
      <div className="row">
        <div className="d-flex justify-content-between col-7 mb-2">
          <p onClick={() => setStep(step - 1)} className="b-text-btn d-flex align-items-center m-0">
            <span className="b-icon-aqua icon-left-arrow mr-2"></span>Volver
          </p>
          <p className="b-text-btn b-text-btn--black m-0">3 de 4</p>
        </div>
      </div>
      <p className="b-text-content-semibold-black-21px px-3">
        Ahora selecciona tus alergias e intolerancias.
      </p>
      <p className="b-text-content-regular-grey-15px">
        Los elementos marcados serán identificados en tus búsquedas como peligrosos para ti.
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        {allergens && (
          <FormThree
            allergens={allergens}
            userAllergens={infoForm.form3.allergens}
            getValues={getValues}
            register={register}
          />
        )}
        <button className="b-btn b-btn my-5">Guardar</button>
      </form>
    </div>
  );
}
