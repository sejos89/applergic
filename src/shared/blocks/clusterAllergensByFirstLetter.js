// funcion que modifica el formato del objeto de alergenos para tenerlos separado por la letra inicial
export const clusterAllergensByFirstLetter = (allergens) => {
  return allergens.reduce((result, word) => {
    const letter = word.name[0].normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Remove accents
    result[letter] = result[letter] || [];
    result[letter].push({ name: word.name, id: word._id });
    return result;
  }, {});
};
