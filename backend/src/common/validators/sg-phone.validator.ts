import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsSgPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isSgPhoneNumber',
      target: object.constructor,
      propertyName,
      options: {
        message: 'Phone number must start with 8 or 9 and have exactly 8 digits',
        ...validationOptions,
      },
      validator: {
        validate(value: unknown) {
          return typeof value === 'string' && /^[89]\d{7}$/.test(value);
        },
      },
    });
  };
}
