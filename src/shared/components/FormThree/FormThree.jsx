import { useEffect } from 'react';
import './FormThree.scss';

export default function FormThree({ allergens, userAllergens, getValues, register }) {
  // funcion que pinta el background de la letra (key) cuando uno de los alergenos de esa letra esta seleccionado
  const showBackground = (key, values) => {
    if (
      // devuelve false si todos son false, y true si alguno esta clickado
      Object.values(getValues(values.map((e) => e.name))).some((v) => v) &&
      !document.getElementsByName(key)[0].className.includes('background-pink')
    ) {
      document.getElementsByName(key).forEach((x) => x.classList.add('background-pink'));
    } else if (!Object.values(getValues(values.map((e) => e.name))).some((v) => v)) {
      document.getElementsByName(key).forEach((x) => x.classList.remove('background-pink'));
    }
  };

  useEffect(() => {
    if (userAllergens) {
      // Todos los alergenos disponibles con clave valor ['A', [{ name: '', id: '' }]]
      Object.entries(allergens)
        .filter(([key, values]) => {
          let isIncluded = false;
          // Nos quedamos unicamente los alérgenos que tenga el usuario en su perfil
          values.forEach((value) => {
            if (userAllergens.includes(value.id)) {
              isIncluded = true;
            }
          });
          return isIncluded;
        })
        .forEach(([key, values]) => {
          // Para cada alérgeno del usuario, lo ponemos rosa
          document.getElementsByName(key).forEach((x) => x.classList.add('background-pink'));
        });
    }
  }, []);

  return (
    <>
      <div id="allergen-keys" className="allergen-keys-container">
        {Object.keys(allergens)
          .sort()
          .map((key) => (
            <a href={'#' + key} key={key} name={key} className="allergen-key-button">
              {key}
            </a>
          ))}
      </div>
      <div>
        {Object.entries(allergens)
          .sort()
          .map(([key, values]) => (
            <>
              <div className="d-flex justify-content-between align-items-center" key={key}>
                <button
                  id={key}
                  name={key}
                  className="allergen-key-button allergen-key-button--small"
                >
                  {key}
                </button>
                <a href="#allergen-keys" className="b-icon icon-up-arrow">
                  <span className="path2"></span>
                </a>
              </div>
              <div className="allergen-value-container">
                {values.map((value) => (
                  <label className="allergen-value-label" key={value.id}>
                    <input
                      className="allergen-value-input"
                      type="checkbox"
                      name={value.name}
                      value={value.id}
                      ref={register}
                      onClick={() => {
                        showBackground(key, values);
                      }}
                    />
                    <span className="allergen-value-span b-text-content-bold-aqua-16px b-text-content-bold-aqua-16px--grey">
                      {value.name}
                    </span>
                  </label>
                ))}
              </div>
            </>
          ))}
      </div>
    </>
  );
}
