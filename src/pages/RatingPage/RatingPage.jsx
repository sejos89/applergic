import { useContext, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Rating } from 'primereact/rating';
import logo_applergic from '../../assets/images/logoApplergicFigurasGiro.png';
import { AuthContext } from '../../shared/context/AuthContext';
import { createRating } from '../../shared/services/rating';
import { addRating, editUser, logout } from '../../shared/services/user';

export default function RatingPage() {
  const { user, setUser } = useContext(AuthContext);
  const [ratingValue, setRatingValue] = useState(1);
  const history = useHistory();

  return (
    <div className="mx-3 mt-4">
      <div className="row pb-4">
        <div className="d-flex justify-content-between col-7 mb-2">
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <p className="b-text-btn d-flex align-items-center m-0">
              <span className="b-icon-aqua icon-left-arrow mr-2"></span>Volver
            </p>
          </Link>
        </div>
      </div>
      <figure className="mt-5">
        <img src={logo_applergic} alt="logo applergic" />
      </figure>
      <p className="b-text-content-semibold-black-21px px-1 mb-4">
        ¡Gracias por usar Applergic! <br />
        <br /> Por favor, evalua tu experiencia.
      </p>
      <Rating
        className="b-primereact-rating"
        value={ratingValue}
        onChange={(e) => setRatingValue(e.value)}
        stars={5}
        cancel={false}
      />
      <p
        className="b-text-content-bold-aqua-16px"
        onClick={() => {
          const ratingObj = { rating: ratingValue };
          createRating(ratingObj).then((data) => {
            const isRatedObj = { isRated: true };
            addRating(isRatedObj).then(() => {
              logout().then(() => {
                setUser(null);
                history.push('/login');
              });
            });
          });
        }}
      >
        Enviar sugerencias
      </p>
    </div>
  );
}
