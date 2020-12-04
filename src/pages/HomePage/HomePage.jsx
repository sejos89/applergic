import './HomePage.scss';

import logo_applergic from '../../assets/images/logoApplergicFigurasGiro.png';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { TieredMenu } from 'primereact/tieredmenu';
import { createRef, useContext } from 'react';
import { logout } from '../../shared/services/user';
import { AuthContext } from '../../shared/context/AuthContext';

export default function HomePage() {
  const { user, setUser } = useContext(AuthContext);

  let history = useHistory();
  let menu = createRef();
  const itemsMenu = [
    {
      icon: 'icon-letter-x',
      command: (event) => menu.hide(event),
      className: 'hide-menu',
    },
    { label: 'Perfil', icon: 'icon-user', command: () => history.push('/edit') },
    { label: 'Favorito', icon: 'icon-star-empty', command: () => history.push('/favorites') },
    { label: 'Diario', icon: 'icon-notebook', command: () => history.push('/diary') },
    // { label: 'Compartir', icon: 'icon-share', command: () => history.push('/home') },
    // { label: 'Traductor', icon: 'icon-translation', command: () => history.push('/home') },
    // { label: 'Términos', icon: 'icon-accept', command: () => history.push('/home') },
    {
      label: 'Salir',
      icon: 'icon-logout',
      command: () => {
        if (!user.isRated) {
          history.push('/rating');
        } else {
          logout().then(() => {
            setUser(null);
            history.push('/login');
          });
        }
      },
      className: 'aqua',
    },
  ];

  return (
    <>
      <div id="backdrop2"></div>
      <div id="backdrop1" className="mx-3 pt-4">
        <div className="d-flex justify-content-between align-items-center">
          {user && (
            <>
              <TieredMenu
                className="b-primereact-tieredMenu"
                model={itemsMenu}
                popup
                ref={(el) => (menu = el)}
                onShow={() => {
                  document.getElementById('backdrop1').classList.add('backdrop-1');
                  document.getElementById('backdrop2').classList.add('backdrop-2');
                }}
                onHide={() => {
                  document.getElementById('backdrop1').classList.remove('backdrop-1');
                  document.getElementById('backdrop2').classList.remove('backdrop-2');
                }}
              />

              <span
                className="b-icon-aqua b-icon-aqua--M icon-menu-button-of-three-horizontal-lines"
                onClick={(event) => menu.show(event)}
              ></span>
              <span className="b-text-btn loginpage-footer3">¡Hola {user.name}!</span>
            </>
          )}
          {/* <div>
            <span className="b-icon b-icon--3rem-grey icon-rounded-info-button"></span>
          </div> */}
        </div>
        <figure className="homepage-logo-figure">
          <img className="img-logo-homepage my-1" src={logo_applergic} alt="logo applergic" />
        </figure>
        <p className="b-text-content-extrabold-black-40px my-1">Applergic</p>
        <p className="b-text-content-medium-grey-18px mi-guia-alimentaria mt-1">
          Mi guía alimentaria
        </p>
        <button
          onClick={() => (user ? history.push('/scan') : history.push('/login'))}
          className="d-flex align-items-center justify-content-center b-btn mt-3 mb-1"
        >
          <span className="b-icon b-icon--3rem-white-qr icon-qr-code"></span>Escanear
        </button>
        <p className="b-text-content-regular-grey-14px mt-1">Escanea un nuevo producto.</p>
        <button
          onClick={() => (user ? history.push('/search') : history.push('/login'))}
          className="d-flex align-items-center justify-content-center b-btn b-btn--disabled mt-3 mb-1"
        >
          <span className="b-icon b-icon--3rem-white-search icon-loupe"></span>Buscar
        </button>
        <p className="b-text-content-regular-grey-14px mt-1">
          Busca un comercio o restaurante para ti.
        </p>
        <a
          href="tel:112"
          className="d-flex align-items-center justify-content-center b-btn b-btn--warning mt-3 mb-1"
        >
          <span className="b-icon b-icon--3rem-white-sos icon-help-lifeguard-symbol"></span>S.O.S.
        </a>
        <p className="b-text-content-regular-grey-14px mt-1">
          ¿Necesitas ayuda? Contactamos con emergencias.
        </p>
      </div>
      <ul className="menu-footer d-flex justify-content-around">
        <li>
          <span className="b-icon-aqua b-icon-aqua--L icon-home"></span>
        </li>
        <li>
          <button
            onClick={() => (user ? history.push('/favorites') : history.push('/login'))}
            className="b-icon b-icon--4rem icon-star-empty b-btn-icon"
          ></button>
        </li>
        <li>
          <button
            onClick={() => (user ? history.push('/diary') : history.push('/login'))}
            className="b-icon b-icon--4rem icon-notebook b-btn-icon"
          ></button>
        </li>
        {/* <li>
            <button
              onClick={() => (user ? history.push('/login') : history.push('/login'))}
              className="b-icon b-icon--4rem icon-share b-btn-icon"
            ></button>
          </li> */}
      </ul>
    </>
  );
}
