import { Link, Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import './LoginPage.scss';
import { loginUser } from '../../shared/services/user';
import { AuthContext } from '../../shared/context/AuthContext';
import { useContext, useState } from 'react';
import Loader from 'react-loader-spinner';

export default function LoginPage() {
  const { handleSubmit, register, errors } = useForm();
  const { user, setUser } = useContext(AuthContext);
  const [falseLogged, setFalseLogged] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = (values) => {
    setLoading(true);
    loginUser(values)
      .then(({ data }) => {
        setLoading(false);
        setUser(data.data);
      })
      .catch((err) => {
        if (!falseLogged) {
          setFalseLogged(!falseLogged);
        }
        setLoading(false);
      });
  };

  if (!!user) {
    return <Redirect to="/home" />;
  }

  if (loading) {
    return (
      <div className="spinner-container">
        <Loader type="Puff" color="#00BFFF" height={100} width={100} timeout={3000} />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column align-items-center loginpage-container">
      <div className="loginpage-header"></div>
      {/* <div className="loginpage-logo-container d-flex justify-content-center align-items-center">
        <div className="b-logo-applergic b-logo-applergic--small"></div>
        <p className="loginpage-logo-title">Applergic</p>
      </div> */}
      <div className="loginsection-container">
        <p className="loginpage-title u-text-align-left">¡Bienvenido de nuevo!</p>
        <p className="loginpage-paragraph u-text-align-left">
          Por favor, introduce tus datos para continuar
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="email"></label>
          <input
            className="b-input"
            type="email"
            name="email"
            id="email"
            placeholder="Dirección e-mail"
            ref={register({ required: true })}
          />
          <label htmlFor="password"></label>
          <input
            className="b-input"
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            ref={register({
              required: true,
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
            })}
          />
          {errors.password && (
            <p className="text-invalid-form">
              La contraseña debe tener mínimo 8 caracteres y al menos una mayúscula, una minúscula y
              un número
            </p>
          )}
          {falseLogged && !errors.password && (
            <p className="text-invalid-form">El usuario y/o la contraseña son incorrectos</p>
          )}
          <button className="b-btn mt-4 mb-1 loginpage-btn">Entrar</button>
        </form>
      </div>
      <div className="container justify-content-center">
        <p className="loginpage-footer1 mb-1">¿nuevo en Applergic?</p>
        <Link to="/register" style={{ textDecoration: 'none' }}>
          <p className="loginpage-footer2 mt-0">Crea tu cuenta aquí</p>
        </Link>
        <Link to="/home" style={{ textDecoration: 'none' }}>
          <p className="b-text-btn loginpage-footer3 mt-3">Me registraré en otro momento</p>
        </Link>
      </div>
    </div>
  );
}
