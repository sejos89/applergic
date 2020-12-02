import { Link } from 'react-router-dom';
import FavoriteGallery from './components/FavoriteGallery/FavoriteGallery';
import './FavoritePage.scss';

export default function FavoritePage() {
  return (
    <div className="d-flex flex-column justify-content-center pt-4">
      <div className="mx-3 d-flex justify-content-end mb-2">
        <Link to="/home" style={{ textDecoration: 'none' }}>
          <button className="icon-letter-x b-icon b-btn-icon ml-1"></button>
        </Link>
      </div>
      <p className="b-text-content-semibold-black-21px px-5 my-1">
        Estos son tus alimentos favoritos:
      </p>
      <FavoriteGallery />
    </div>
  );
}
