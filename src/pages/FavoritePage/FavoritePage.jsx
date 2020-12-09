import { Link } from 'react-router-dom';
import FavoriteGallery from './components/FavoriteGallery/FavoriteGallery';
import './FavoritePage.scss';

export default function FavoritePage() {
  return (
    <div className="d-flex flex-column justify-content-center pt-4">
      <div className="mx-3 mb-2">
        <Link to="/home" style={{ textDecoration: 'none' }}>
          <button className="b-text-btn d-flex align-items-center ml-1 b-btn-icon">
            <span className="b-icon-aqua icon-left-arrow mr-2"></span>Volver
          </button>
        </Link>
      </div>
      <p className="b-text-content-semibold-black-21px px-5 my-1">
        Estos son tus alimentos favoritos:
      </p>
      <FavoriteGallery />
    </div>
  );
}
