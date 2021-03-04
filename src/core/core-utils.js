export function generateCustomElementName(nameBase = '') {
  return nameBase
    .split('')
    .map((char, index, array) => {
      const lowerCase = char.toLowerCase();
      const upperCase = char.toUpperCase();

      const previous = index > 0 ? array[index - 1] : '';
      const next = index < array.length - 1 ? array[index + 1] : '';

      const isNotFirst = index > 0;
      const isUpperCase = char === upperCase;
      const previousIsUpperCase = previous === previous?.toUpperCase();
      const nextIsUpperCase = next === next?.toUpperCase();

      if (isNotFirst && isUpperCase && !(previousIsUpperCase && nextIsUpperCase))
        return `-${lowerCase}`;

      return lowerCase;
    }).join('');
}

export function capitalize(string = '') {
  return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
}
