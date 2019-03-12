/**
 * Handles form validation
 */
import Bouncer from 'formbouncerjs';

const formValidation = {
  init: () => {
    Bouncer('[data-validate]', {
      fieldClass: 'is-invalid',
      errorClass: 'c-form__error',
    });
  },
};

formValidation.init();

export default formValidation;
