/**
 * Handles form validation
 */
import validate from 'validate';

const formValidation = {
  init: () => {
    validate.init({
      selector: '[data-validate]',
      fieldClass: 'is-invalid',
      errorClass: 'c-form__error',
    });
  },
};

formValidation.init();

export default formValidation;
