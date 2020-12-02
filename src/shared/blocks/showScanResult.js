export const showScanResult = (item, user_allergensObj, result, matches_allergens) => {
  const user_allergens = user_allergensObj.map((allergen) => allergen._id);

  if (!user_allergens || user_allergens.length === 0) {
    return;
  }

  if (typeof item[0] === 'string') {
    matches_allergens = item.filter((element) => user_allergens.includes(element));
  } else {
    matches_allergens = item.filter((element) => user_allergens.includes(element._id));
  }

  if (matches_allergens.length === 0) {
    result = 1;
  } else {
    result = 2;
  }
};
