import _ from 'lodash';

type ValidatorType =
  | 'array'
  | 'string'
  | 'number'
  | 'boolean'
  | 'function'
  | 'object'
  | 'date'
  | 'nil';

const validators: Record<ValidatorType, (value: unknown) => boolean> = {
  array: _.isArray,
  string: _.isString,
  number: _.isNumber,
  boolean: _.isBoolean,
  function: _.isFunction,
  object: _.isPlainObject,
  date: _.isDate,
  nil: _.isNil,
};

export const validator = <T extends ValidatorType>(
  type: T,
  ...values: unknown[]
): boolean => values.every((value) => validators[type](value));
