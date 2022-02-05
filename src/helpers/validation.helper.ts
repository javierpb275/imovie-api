export const validateObjectProperties = (
  someObject: any,
  allowedProperties: string[]
): boolean => {
  const objectProperties: string[] = Object.keys(someObject);
  const isValidOperation: boolean = objectProperties.every((property) =>
    allowedProperties.includes(property)
  );
  return isValidOperation;
};
