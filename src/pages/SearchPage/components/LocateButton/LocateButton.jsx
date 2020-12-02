import './LocateButton.scss';

export default function LocateButton(props) {
  return (
    <button
      className="locate"
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            props.setViewport({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          () => null,
        );
      }}
    >
      <img src="/gps-fixed-indicator.svg" alt="locate me" />
    </button>
  );
}
