import { Constants } from '../../const/Constants';

const { DATA_NOT_FOUND_FOR_VALIDATION, INVALID_INPUT_SCHEMA } =
  Constants.ErrorMessage;
export class JoiValidator {
  joiValidation(value: any, joiSchema: any) {
    if (!value) {
      throw {
        message: DATA_NOT_FOUND_FOR_VALIDATION,
      };
    }
    if (!joiSchema) {
      throw {
        message: INVALID_INPUT_SCHEMA,
      };
    }

    return joiSchema.validate(value);
  }
}

const joiValidator: JoiValidator = new JoiValidator();

export default joiValidator;
