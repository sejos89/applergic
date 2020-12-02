import './SearchPage.scss';

import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
  MarkerClusterer,
} from '@react-google-maps/api';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
// import * as allRestaurants from './data/restaurants.json';
import LocateButton from './components/LocateButton/LocateButton';
import SearchBar from './components/SearchBar/SearchBar';
import { getRestaurants } from '../../shared/services/restaurants';
import { displayWords } from '../../shared/blocks/displayWords';
import { AuthContext } from '../../shared/context/AuthContext';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
};

let allRestaurants = [];

const options = {
  disableDefaultUI: true,
  styles: [
    { featureType: 'poi', stylers: [{ visibility: 'off' }] },
    {
      featureType: 'transit',
      elementType: 'labels.icon',
      stylers: [{ visibility: 'off' }],
    },
  ],
};

export default function SearchPage() {
  const { user } = useContext(AuthContext);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_KEY,
    libraries,
  });

  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [filteredRestaurants, setFilteredRestaurants] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [initPosition, setInitPosition] = useState({});

  const getInitPosition = (position) => {
    const initPosition = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    setInitPosition(initPosition);
  };

  const switchRestaurantArr = () => {
    const user_allergens = user.allergens.map((allergen) => allergen._id);

    setFilteredRestaurants(!filteredRestaurants);
    if (!filteredRestaurants) {
      setRestaurants(
        allRestaurants.filter(
          (restaurant) =>
            !user_allergens.find((item) =>
              restaurant.allergens.map((allergen) => allergen._id).includes(item),
            ),
        ),
      );
    } else {
      setRestaurants(allRestaurants);
    }
    console.log(restaurants.length);
  };

  useEffect(() => {
    getRestaurants().then((res) => {
      allRestaurants = res.data;
      setRestaurants(allRestaurants);
    });
    navigator.geolocation.getCurrentPosition(getInitPosition);
  }, []);

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(15);
    console.log(mapRef.current.getBounds());
  }, []);

  if (loadError) return 'Error loading maps';

  if (!isLoaded) return 'Loading Maps';

  return (
    <div className="mt-4">
      <div className="mx-3 mb-2">
        <Link to="/home" style={{ textDecoration: 'inherit' }}>
          <p className="b-text-btn d-flex align-items-center m-0">
            <span className="b-icon-aqua icon-left-arrow mr-2"></span>Volver
          </p>
        </Link>
      </div>
      <div>
        <LocateButton panTo={panTo} />
        <SearchBar panTo={panTo} />
        <button
          className={`restaurants-filter-button ${filteredRestaurants ? 'clicked-button' : ''}`}
          onClick={switchRestaurantArr}
        >
          Compatibles contigo
        </button>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={16}
          center={initPosition}
          options={options}
          onLoad={onMapLoad}
        >
          <MarkerClusterer>
            {(clusterer) =>
              restaurants.map((restaurant) => (
                <Marker
                  key={restaurant.id}
                  // position={{ lat: restaurant.coordinates[0], lng: restaurant.coordinates[1] }}

                  clusterer={clusterer}
                  onClick={() => {
                    setSelectedRestaurant(restaurant);
                  }}
                  icon={{
                    url: '/restaurant.svg',
                    scaledSize: new window.google.maps.Size(25, 25),
                  }}
                />
              ))
            }
          </MarkerClusterer>

          {selectedRestaurant && (
            <InfoWindow
              position={{
                lat: selectedRestaurant.coordinates[0],
                lng: selectedRestaurant.coordinates[1],
              }}
              onClose={() => setSelectedRestaurant(null)}
            >
              <>
                <h2>Restaurante: {selectedRestaurant.name}</h2>
                <p>
                  <b>alérgenos: </b>{' '}
                  {displayWords(
                    selectedRestaurant.allergens.map((allergen) => allergen.name.toLowerCase()),
                  )}
                </p>
              </>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </div>
  );
}
