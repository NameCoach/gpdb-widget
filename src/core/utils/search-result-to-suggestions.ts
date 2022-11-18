import {
  NAME_PARTS_MAX_ALLOWED_COUNT,
  SUGGESTIONS_ALLOWED_COUNT,
} from "../../constants";

const capitalize = (string: string): string =>
  string.charAt(0).toUpperCase() + string.slice(1);

const getNamesCombinations = (objectWithArrayValues: object): Array<any> => {
  const recursive = (keys: Array<string>): Array<any> => {
    if (!keys.length) return [{}];

    const result = recursive(keys.slice(1));

    return objectWithArrayValues[keys[0]].reduce(
      (acc, value) =>
        acc.concat(
          result.map((item) => Object.assign({}, item, { [keys[0]]: value }))
        ),
      []
    );
  };

  return recursive(Object.keys(objectWithArrayValues));
};

const searchResultsToSuggestions = (
  name: string,
  fullNames: string[],
  allNames: string[]
): string[] => {
  let namesToSuggest = [];
  let hash = {};

  const nameParts = name.split(" ").map((item) => item.toLowerCase());

  if (fullNames.length > 0) {
    const fullName = fullNames.join(" ");
    namesToSuggest.push(fullName);
  }

  if (nameParts.length > NAME_PARTS_MAX_ALLOWED_COUNT) return namesToSuggest;

  nameParts.forEach((namePart) => (hash[`${namePart}`] = []));

  allNames.forEach((item: string) => {
    Object.keys(hash).forEach((key) => {
      if (item.includes(key)) hash[key].push(item);
    });
  });

  hash = nameParts.reverse().reduce((obj, key) => {
    obj[key] = hash[key];
    return obj;
  }, {});

  const namePartsCombinations = getNamesCombinations(hash).map((object) =>
    Object.values(object).join(" ")
  );

  namesToSuggest = namesToSuggest
    .concat(namePartsCombinations)
    .filter((x, i, a) => a.indexOf(x) === i)
    .slice(0, SUGGESTIONS_ALLOWED_COUNT)
    .map((name) =>
      name
        .split(" ")
        .map((item) => capitalize(item))
        .join(" ")
    );

  return namesToSuggest;
};

export default searchResultsToSuggestions;
