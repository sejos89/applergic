export const convertArrayToObject = (array, key, id, array2) => {
  const initialValue = {};
  return array.reduce((obj, item) => {
    if (array2.includes(item[id])) {
      return {
        ...obj,
        [item[key]]: item[id],
      };
    }
    return {
      ...obj,
      [item[key]]: false,
    };
  }, initialValue);
};
