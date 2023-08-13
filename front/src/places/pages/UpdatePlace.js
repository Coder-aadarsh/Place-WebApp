import React , {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import './NewPlace.css';
import Card from '../../shared/components/UIElements/Card';
const PLACES = [
  {
    id:'p1',
    title: 'Qutub Minar',
    imageUrl: 'https://www.thetatva.in/wp-content/uploads/2020/12/53331482_2283781921869816_2361277172979920993_n.jpg',
    address: 'Seth Sarai, Mehrauli, New Delhi, Delhi 110016',
    description: 'LOL here is the lost description element',
    location: {
        lat: 28.5236658,
        lng: 77.1835536
    },
    creator: 'u1'
},
{
    id:'p2',
    title: 'Taj Mahal',
    imageUrl: 'https://www.thetatva.in/wp-content/uploads/2020/12/53331482_2283781921869816_2361277172979920993_n.jpg',
    address: 'Seth Sarai, Mehrauli, New Delhi, Delhi 110016',
    description: 'one of the seven wonders of the world',
    location: {
        lat: 28.5236658,
        lng: 77.1835536
    },
    creator: 'u2'
}
];

const UpdatePlace = () => {
    const [isLoading, setIsLoading] = useState(true);
    const placeId = useParams().placeId;
  
    const [formState, inputHandler, setFormData] = useForm(
      {
        title: {
          value: '',
          isValid: false
        },
        description: {
          value: '',
          isValid: false
        }
      },
      false
    );
  
    const identifiedPlace = PLACES.find(p => p.id === placeId);
  
    useEffect(() => {
      if(identifiedPlace){
        setFormData(
          {
            title: {
              value: identifiedPlace.title,
              isValid: true
            },
            description: {
              value: identifiedPlace.description,
              isValid: true
            }
          },
          true
        );
      }
      setIsLoading(false);
    }, [setFormData, identifiedPlace]);
  
    const placeUpdateSubmitHandler = event => {
      event.preventDefault();
      console.log(formState.inputs);
    };
  
    if (!identifiedPlace) {
      return (
        <div className="center">
          <h2>Could not find place!</h2>
        </div>
      );
    }
  
    if (isLoading) {
      return (
        <Card>
            <div className="center">
               <h2>Loading...</h2>
            </div>
        </Card>
      );
    }
  
    return (
      <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
          initialValue={formState.inputs.title.value}
          initialValid={formState.inputs.title.isValid}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (min. 5 characters)."
          onInput={inputHandler}
          initialValue={formState.inputs.description.value}
          initialValid={formState.inputs.description.isValid}
        />
        <Button type="submit" disabled={!formState.isValid}>
          UPDATE PLACE
        </Button>
      </form>
    );
  };
  
  export default UpdatePlace;
  
  