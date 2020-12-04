import './FormPageFour.scss';
import imagen from '../../../../assets/images/ok.png';

import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { FormContext } from '../../context/FormContext';
import { AuthContext } from '../../../../shared/context/AuthContext';

export default function FormPageFour() {
  const { infoForm, setInfoForm, step, setStep } = useContext(FormContext);

  const { user } = useContext(AuthContext);

  console.log(user);
  return (
    <div className="mx-3 mt-4">
      <div className="row pb-4">
        <div className="d-flex justify-content-between col-7 mb-2">
          <p onClick={() => setStep(step - 1)} className="b-text-btn d-flex align-items-center m-0">
            <span className="b-icon-aqua icon-left-arrow mr-2"></span>Volver
          </p>
          <p className="b-text-btn b-text-btn--black m-0">4 de 4</p>
        </div>
        <div className="col-5 d-flex justify-content-end">
          <Link to="/home" style={{ textDecoration: 'none' }}>
            <span className="b-icon icon-letter-x"></span>
          </Link>
        </div>
      </div>
      <figure className="mt-5 check-perfect-figure">
        <img src={imagen} alt="" />
      </figure>
      <p className="b-text-content-semibold-black-21px px-1">
        Hemos terminado, ya puedes escanear tu primer producto.
      </p>
      <Link to="/scan">
        <button className="b-btn my-5">Escanea un producto</button>
      </Link>
    </div>
  );
}
