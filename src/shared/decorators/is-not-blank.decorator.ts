import { registerDecorator, ValidationOptions } from 'class-validator';

/**
 * Checks if the string is not blank.
 */
export function IsNotBlank(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isNotBlank',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'string' && value.trim().length > 0;
        },

        defaultMessage() {
          // Set the default error message here
          return `${propertyName} must not be blank`;
        },
      },
    });
  };
}
