import { useState, useContext, Fragment, useMemo } from 'react';
import { Redirect } from 'react-router-dom';
import FormPageFour from './components/FormPageFour/FormPageFour';
import FormPageOne from './components/FormPageOne/FormPageOne';
import ConfirmPage from './components/ConfirmPage/ConfirmPage';
import FormPageThree from './components/FormPageThree/FormPageThree';
import FormPageTwo from './components/FormPageTwo/FormPageTwo';
import { FormContext } from './context/FormContext';
import { AuthContext } from '../../shared/context/AuthContext';

const showStep = (step) => {
  switch (step) {
    case 1:
      return <FormPageOne />;
    case 2:
      return <FormPageTwo />;
    case 3:
      return <FormPageThree />;
    case 4:
      return <ConfirmPage />;
    case 5:
      return <FormPageFour />;
    default:
      return <Fragment />;
  }
};

const initialFormState = {
  form1: {},
  form2: {},
  form3: { allergens: [], allergens_raw: {} },
};

export default function RegisterPage() {
  const { user } = useContext(AuthContext);

  // Variable de estado para cambiar las paginas del formulario
  const [step, setStep] = useState(1);

  // Variable de estado para cambiar el estado global del Context
  const [infoForm, setInfoForm] = useState(initialFormState);

  const StepComponent = useMemo(() => showStep(step), [step]);

  if (!!user && step === 1) {
    return <Redirect to="/home" />;
  }

  return (
    <>
      <FormContext.Provider value={{ infoForm, setInfoForm, step, setStep }}>
        {/* con el useMemo hacemos que no se llame showStep cuando cambie la variable de estado infoForm, ya que solo queremos renderizarla cuando cambie el step  */}
        {StepComponent}
      </FormContext.Provider>
    </>
  );
}
