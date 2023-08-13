import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './Auth.css';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Auth = () => {
    const auth = useContext(AuthContext);
    const [isLoginMode, setIsLoginMode] = useState(true);

    const {isLoading, error, sendRequest, clearError} = useHttpClient();

    const [formState, inputHandler, setFormData] = useForm(
        {
        email: {
            value: '',
            isValid: false
        },
        password: {
            value: '',
            isValid: false
        }
        },
        false
    );

    const switchModeHandler = () => {
        if (!isLoginMode) {
        setFormData(
            {
            ...formState.inputs,
            name: undefined
            },
            formState.inputs.email.isValid && formState.inputs.password.isValid
        );
        } else {
        setFormData(
            {
            ...formState.inputs,
            name: {
                value: '',
                isValid: false
            }
            },
            false
        );
        }
        setIsLoginMode(prevMode => !prevMode);
    };

    const authSubmitHandler = async event =>{
        event.preventDefault();

        if(isLoginMode){

            try{
                //Sending Post Request TO SIGNUP
                // fetch api provided by browsers we can use axios or other 3rd party lib but here we use - built in fetch 
                const responseData = await sendRequest(
                    'http://localhost:5000/api/users/login', 
                    'POST',
                    JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    }),
                    {
                        'Content-Type': 'application/json'
                    }

                );
                auth.login(responseData.user.id); // this will only run once we are done running the response, parsing it (since above are await functions)
            
            }catch(err){

            }

        }else {
            //Sending Post Request TO SIGNUP
            try{
                // fetch api provided by browsers we can use axios or other 3rd party lib but here we use - built in fetch
                
                const responseData = await sendRequest(
                    'http://localhost:5000/api/users/signup',
                    'POST',
                    JSON.stringify({
                        name: formState.inputs.name.value,
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    }),
                    {
                        'Content-Type': 'application/json'
                    },

                );

                auth.login(responseData.user.id); // this will only run once we are done running the response, parsing it (since above are await functions)
            }
            catch(err){

            }
        }
    };


    return (
        <>
        <ErrorModal error = {error} onClear={clearError} />
        <Card className="authentication">
            {isLoading && <LoadingSpinner asOverlay/>}
            <h2>{isLoginMode ? 'Login Required' : 'Register Yourself'}</h2>
            <hr/>
            <form>
                {!isLoginMode && <Input element="input" id="name" type="text" label="Username"  
                validators={[VALIDATOR_REQUIRE]} errorText="Please enter a name !" onInput={inputHandler} />}
                <Input 
                element="input" 
                id="email" 
                type="email" 
                label="E-mail" 
                validators={[VALIDATOR_EMAIL()]} 
                errorText= "Please enter a valid email address"
                onInput={inputHandler}
                />
                <Input 
                element="input" 
                id="password" 
                type="password" 
                label="Password" 
                validators={[VALIDATOR_MINLENGTH(5)]} 
                errorText= "Please enter a valid Password (5 char)"
                onInput={inputHandler}
                />
                <Button type="submit" onClick={authSubmitHandler} disabled={!formState.isValid}>
                    {isLoginMode ? 'LOGIN' : 'REGISTER'}
                </Button> 
            </form>
            <Button inverse onClick={switchModeHandler}>SWITCH TO {isLoginMode ?'REGISTER' :'LOGIN'}</Button>
        </Card>
        </>
    );
};

export default Auth; 