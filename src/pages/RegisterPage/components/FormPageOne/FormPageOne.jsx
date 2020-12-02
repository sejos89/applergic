import './FormPageOne.scss';

import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useContext, useState } from 'react';
import { FormContext } from '../../context/FormContext';
import FormOne from '../../../../shared/components/FormOne/FormOne';
import { checkUsername } from '../../../../shared/services/user';

export default function FormPageOne() {
  const fromRegister = true;
  const { infoForm, setInfoForm, step, setStep } = useContext(FormContext);
  const [userExist, setUserExist] = useState(false);

  const { register, handleSubmit, reset, errors, formState } = useForm({
    mode: 'onChange', // Para que la validacion se haga caracter de cada input
    defaultValues: {
      image: infoForm.form1.image,
      name: infoForm.form1.name,
      email: infoForm.form1.email,
      phone: infoForm.form1.phone,
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    checkUsername(data.email).then((res) => {
      if (res.data) {
        setUserExist(true);
      } else {
        setInfoForm({ ...infoForm, form1: { ...data, image_preview: profileImage } });
        setStep(step + 1);
      }
    });
  };

  // Para deshabilitar el boton de submit si no se validan los campos del formulario
  const { isValid } = formState;

  // Para hacer el preview de la foto de perfil y editarla
  const [profileImage, setProfileImage] = useState(infoForm.form1.image_preview);
  const handleChange = (e) => {
    if (e.target.files[0]) {
      setProfileImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="mx-3 mt-4">
      <div className="row">
        <div className="d-flex justify-content-between col-7 mb-2">
          <Link to="/login" style={{ textDecoration: 'inherit' }}>
            <p className="b-text-btn d-flex align-items-center m-0">
              <span className="b-icon-aqua icon-left-arrow mr-2"></span>Volver
            </p>
          </Link>
          <p className="b-text-btn b-text-btn--black m-0">1 de 4</p>
        </div>
        <div className="col-5 d-flex justify-content-end">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span className="icon-home b-icon"></span>
          </Link>
        </div>
      </div>
      <p className="b-text-content-semibold-black-21px">Dinos quién eres</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormOne
          register={register}
          errors={errors}
          profileImage={profileImage}
          infoForm={infoForm.form1}
          handleChange={handleChange}
          fromRegister={fromRegister}
          userExist={userExist}
        />
        <button
          className={!isValid ? 'b-btn b-btn--disabled my-5' : 'b-btn my-5'}
          disabled={!isValid}
        >
          Guardar perfil
        </button>
      </form>
    </div>
  );
}
