import { useState } from 'react';
import './SplashPage.scss';
import imagen1 from '../../assets/images/scan-2.png';
import imagen2 from '../../assets/images/rectangle.png';
import imagen3 from '../../assets/images/ambulancia.png';
import imagen4 from '../../assets/images/traduccion.png';
import { Link } from 'react-router-dom';

const carouselArr = [
  {
    image: imagen1,
    content: {
      __html:
        '¡Bienvenido a <strong>Applergic</strong>! <br />Escanea el código de barras de tu producto y Applergic te dirá si es apto para ti.',
    },
  },
  {
    image: imagen2,
    content: {
      __html: 'Lleva tu Diario de compras y actividades.',
    },
  },
  {
    image: imagen3,
    content: {
      __html: 'En caso de emergencia nos pondremos en contacto con la persona que nos digas.',
    },
  },
  {
    image: imagen4,
    content: {
      __html:
        'Viaja a donde quieras. Tendrás a tu disposición un traductor off-line y tu informe de alergias e intolerancias traducido al idioma local',
    },
  },
];

export default function HomePage() {
  const [homeCarousel, setHomeCarousel] = useState(true);
  const [slideCarousel, setSlideCarousel] = useState(0);

  return (
    <>
      {homeCarousel && (
        <div onClick={() => setHomeCarousel(false)}>
          <div className="homepage-header d-flex flex-column justify-content-end">
            <p className="homepage-title">Applergic</p>
            <p className="homepage-subtitle">Mi guía alimentaria</p>
          </div>
          <div className="homepage-logo"></div>
        </div>
      )}

      {!homeCarousel && (
        <>
          <div className="carousel-title-container d-flex justify-content-center align-items-center">
            <div className="b-logo-applergic"></div>
            <p className="carousel-title">Applergic</p>
          </div>
          <div className="carousel-container d-flex flex-column justify-content-start align-items-center">
            <figure>
              <img src={carouselArr[slideCarousel].image} alt="applergic" />
            </figure>
            <p
              className="carousel-content"
              dangerouslySetInnerHTML={carouselArr[slideCarousel].content}
            />
          </div>
          <div className="carousel-button-container d-flex flex-column justify-content-between">
            <div className="carousel-button-pagination d-flex justify-content-around align-items-center">
              <span
                className={slideCarousel === 0 ? 'bullet bullet--not-selected' : 'bullet'}
              ></span>
              <span
                className={slideCarousel === 1 ? 'bullet bullet--not-selected' : 'bullet'}
              ></span>
              <span
                className={slideCarousel === 2 ? 'bullet bullet--not-selected' : 'bullet'}
              ></span>
              <span
                className={slideCarousel === 3 ? 'bullet bullet--not-selected' : 'bullet'}
              ></span>
            </div>
            <div className="d-flex justify-content-between align-items-end">
              <Link
                className="b-text-btn b-text-btn--grey"
                to="/login"
                style={{ textDecoration: 'none' }}
              >
                <p className="mt-0 mb-3">Saltar</p>
              </Link>
              {slideCarousel < 3 ? (
                <p
                  className="b-text-btn b-text-btn--grey d-flex align-items-center mt-0 mb-3"
                  onClick={() => setSlideCarousel(slideCarousel + 1)}
                >
                  Siguiente<span className="b-icon icon-next ml-2"></span>
                </p>
              ) : (
                <Link
                  className="b-text-btn b-text-btn--grey"
                  to="/login"
                  style={{ textDecoration: 'none' }}
                >
                  <p className="mt-0 mb-3">Terminar</p>
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
