//a hook is a normal Javascript function but a function that starts with use, that's just a convention though, more importantly a function which can share stateful logic,
//so a function which can for example use use reducer or use state inside of it and which React then recognizes and uses such that when in this custom hook, you do something that updates a state your component that
//uses your custom hook is re-rendered. So it's a special function React recognizes you could say, a special function you can use in functional
//components which React recognizes and where if inside of that function you change something that impacts the state, React will re-render a component that uses your custom hook//

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

import { useCallback, useReducer } from 'react';

const formReducer = (state, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE':
      let formIsValid = true;
      for (const inputId in state.inputs) {
        if(!state.inputs[inputId]){
          continue;
        }
        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid }
        },
        isValid: formIsValid
      };
      case 'SET_DATA':
        return {
            inputs:action.inputs,
            isValid: action.formIsValid
        };
    default:
      return state;
  }
};

export const useForm = (initialInputs, initialFormValidity) => {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialFormValidity
  });
  // input - checks whether each input of a form is valis or not, while isValid stores whether entire form is valid or not.

  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: 'INPUT_CHANGE',
      value: value,
      isValid: isValid,
      inputId: id
    });
  }, []);

  const setFormData = useCallback((inputData, formValidity)=>{
    dispatch({
        type: 'SET_DATA',
        inputs: inputData,
        formIsValid: formValidity
    });
  }, []);

  return [formState, inputHandler, setFormData];
};