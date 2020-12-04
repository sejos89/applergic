import { useContext, useEffect, useRef, useState } from 'react';
import ReactMapGL, { Marker, Popup, FlyToInterpolator, GeolocateControl } from 'react-map-gl';
import Geocoder from 'react-map-gl-geocoder';
import useSupercluster from 'use-supercluster';
import { Link } from 'react-router-dom';
import { displayWords } from '../../shared/blocks/displayWords';
import { AuthContext } from '../../shared/context/AuthContext';
import { getRestaurants } from '../../shared/services/restaurants';
import './SearchPage2.scss';

let allRestaurants = [];
const bounds_init = [-3.797936032714773, 40.22302829052748, -3.540443967284716, 40.64740409236745];

export default function SearchPage2() {
  const { user } = useContext(AuthContext);

  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [filteredRestaurants, setFilteredRestaurants] = useState(false);
  const [restaurants, setRestaurants] = useState([]);

  const [viewport, setViewport] = useState({
    //supongo que aquí deberíamos poner algo para que salga por defecto en caso de que no detecte geolocalización.
    width: '100%',
    height: '80vh',
    latitude: 40.416946,
    longitude: -3.703528,
    zoom: 10,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setViewport({
        ...viewport,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
    });
  }, []);

  const [bounds, setBounds] = useState();

  const mapRef = useRef();
  const geocoderContainerRef = useRef();

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
  };

  useEffect(() => {
    if (bounds) {
      getRestaurants(bounds).then((res) => {
        allRestaurants = res.data;
        setRestaurants(allRestaurants);
      });
    }
  }, [bounds]);

  const points = restaurants.map((restaurant) => ({
    type: 'Feature',
    properties: {
      cluster: false,
      restaurantId: restaurant._id,
      name: restaurant.name,
      allergens: restaurant.allergens,
    },
    geometry: {
      type: 'Point',
      coordinates: [restaurant.coordinates[1], restaurant.coordinates[0]],
    },
  }));

  // get clusters
  const { clusters, supercluster } = useSupercluster({
    points,
    zoom: viewport.zoom,
    bounds,
    options: { radius: 50, maxZoom: 20 },
  });

  return (
    <div className="mt-4">
      <div className="mx-3 mb-2">
        <Link to="/home" style={{ textDecoration: 'inherit' }}>
          <p className="b-text-btn d-flex align-items-center m-0">
            <span className="b-icon-aqua icon-left-arrow mr-2"></span>Volver
          </p>
        </Link>
      </div>
      <div style={{ position: 'relative' }}>
        <div ref={geocoderContainerRef} className="b-react-geocoder" />
        <button
          className={`restaurants-filter-button ${filteredRestaurants ? 'clicked-button' : ''}`}
          onClick={switchRestaurantArr}
        >
          Compatibles contigo
        </button>
        <ReactMapGL
          {...viewport}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          onViewportChange={(viewport) => setViewport(viewport)}
          ref={mapRef}
          onInteractionStateChange={(interactionState) =>
            // !interactionState.isPanning && setViewportToSend(viewport)
            !interactionState.isPanning &&
            setBounds(
              mapRef.current ? mapRef.current.getMap().getBounds().toArray().flat() : bounds_init,
            )
          }
        >
          <GeolocateControl
            className="locate-button"
            positionOptions={{ enableHighAccuracy: true }}
            trackUserLocation={true}
          />
          <Geocoder
            mapRef={mapRef}
            containerRef={geocoderContainerRef}
            onViewportChange={(viewport) => setViewport(viewport)}
            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
            inputValue=""
            language="es"
            placeholder="Buscar..."
            clearOnBlur={true}
          />
          {clusters.map((cluster) => {
            const [longitude, latitude] = cluster.geometry.coordinates;
            const { cluster: isCluster, point_count: pointCount } = cluster.properties;
            if (isCluster) {
              return (
                <Marker key={cluster.id} latitude={latitude} longitude={longitude}>
                  <div
                    className="cluster-marker"
                    style={{
                      width: `${30 + (pointCount / points.length) * 50}px`,
                      height: `${30 + (pointCount / points.length) * 50}px`,
                    }}
                    onClick={() => {
                      const expansionZoom = Math.min(
                        supercluster.getClusterExpansionZoom(cluster.id),
                        20,
                      );
                      setViewport({
                        ...viewport,
                        latitude,
                        longitude,
                        zoom: expansionZoom,
                        transitionInterpolator: new FlyToInterpolator({ speed: 2 }),
                        transitionDuration: 'auto',
                      });
                    }}
                  >
                    {pointCount}
                  </div>
                </Marker>
              );
            }

            return (
              <Marker
                key={cluster.properties.restaurantId}
                latitude={latitude}
                longitude={longitude}
              >
                <button
                  className="marker-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedRestaurant(cluster);
                  }}
                >
                  <img src="/restaurant.svg" alt="restaurant" />
                </button>
              </Marker>
            );
          })}

          {selectedRestaurant && (
            <Popup
              latitude={selectedRestaurant.geometry.coordinates[1]}
              longitude={selectedRestaurant.geometry.coordinates[0]}
              onClose={() => setSelectedRestaurant(null)}
            >
              <div className="popup-container">
                <h3>Restaurante: {selectedRestaurant.properties.name}</h3>
                <p>
                  <b>alérgenos: </b>{' '}
                  {displayWords(
                    selectedRestaurant.properties.allergens.map((allergen) =>
                      allergen.name.toLowerCase(),
                    ),
                  )}
                </p>
              </div>
            </Popup>
          )}
        </ReactMapGL>
      </div>
    </div>
  );
}
