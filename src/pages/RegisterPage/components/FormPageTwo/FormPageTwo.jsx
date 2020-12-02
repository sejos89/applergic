import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useContext } from 'react';
import { FormContext } from '../../context/FormContext';
import FormTwo from '../../../../shared/components/FormTwo/FormTwo';

export default function FormPageTwo() {
  const { infoForm, setInfoForm, step, setStep } = useContext(FormContext);

  const { register, handleSubmit, reset, errors } = useForm({
    // mode: 'onChange',
    defaultValues: {
      emergency_name: infoForm.form2.emergency_name,
      emergency_email: infoForm.form2.emergency_email,
      emergency_phone: infoForm.form2.emergency_phone,
      insurance: infoForm.form2.insurance,
      policy: infoForm.form2.policy,
    },
  });

  const onSubmit = (data) => {
    setInfoForm({ ...infoForm, form2: data });
    setStep(step + 1);
  };

  console.log(infoForm);

  // Para deshabilitar el boton de submit si no se validan los campos del formulario
  // const { isValid } = formState;

  return (
    <div className="mx-3 mt-4">
      <div className="row">
        <div className="d-flex justify-content-between col-7 mb-2">
          <p
            onClick={() => {
              setStep(step - 1);
            }}
            className="b-text-btn d-flex align-items-center m-0"
          >
            <span className="b-icon-aqua icon-left-arrow mr-2"></span>Volver
          </p>
          <p className="b-text-btn b-text-btn--black m-0">2 de 4</p>
        </div>
      </div>
      <p className="b-text-content-semibold-black-21px px-3">
        Vamos a añadir tu contacto en caso de emergencia.
      </p>
      <p className="b-text-content-regular-grey-15px">
        Nos pondremos en contacto con tu persona de confianza y/o compañía de seguros en caso de
        emergencia.
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormTwo register={register} />
        <button className={'b-btn mt-4'}>Guardar emergencias</button>
      </form>
      <p onClick={() => setStep(step + 1)} className="b-text-btn mt-3">
        Registraré mi contacto en otro momento
      </p>
    </div>
  );
}
