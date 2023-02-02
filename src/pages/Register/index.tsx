import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from '../../api/axios';

import './style.css';

const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

function Register(props: any){
    const [login, setLogin] = useState('');

    const [email, setEmail] = useState('');
    const [emailValid, setEmailValid] = useState(true);
    const [emailAlreadyExists, setemailAlreadyExists] = useState(false);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [passwordMatch, setPasswordMatch] = useState(true);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        console.log(passwordMatch)
        console.log(emailValid);

        if(!passwordMatch || !emailValid){
            return
        }

        try{
            const response = await axios.post("/user", 
            {login, email, password },
            );

            if(response.status === 200){
                window.location.href = "/login"
            }
        }catch(err){
            const error = err as AxiosError
            console.log(error)
            if(error.code === "ERR_NETWORK"){
                window.alert("Sem internet");
                return
            }

            setemailAlreadyExists(true);
        }
    }

    useEffect(() => {
        const result = EMAIL_REGEX.test(email) || email.length < 1;
        setEmailValid(result);
    }, [email])

    useEffect(() => {
        const result = !(password.length >= 1 && confirmPassword.length >= 1) || password === confirmPassword;
        setPasswordMatch(result);
    }, [password, confirmPassword])



    return (
        <div id="register-container">
            <form onSubmit={handleSubmit} id="register-form">
                <h2>Register</h2>

                <p className={passwordMatch ? "hide" : "warning"}>Password dont match</p>
                <p className={emailAlreadyExists? "warning": "hide"}>Email already exists</p>

                <input 
                    type="text"
                    name="login" 
                    value={login} 
                    autoComplete="off"
                    required
                    onChange={event => setLogin(event.target.value)} 
                    placeholder="Login" 
                />
                
                <input 
                    id="email"          
                    autoComplete="off"
                    required
                    className={emailValid ? "" : "invalid"}
                    onChange={event => setEmail(event.target.value)} 
                    placeholder="Email"
                />

                <input 
                    type={"password"} 
                    name="password" 
                    value={password} 
                    autoComplete="off"
                    required
                    className={passwordMatch ? "" : "invalid"}
                    onChange={event => setPassword(event.target.value)} 
                    placeholder="Password"
                />

                <input 
                    type={"password"} 
                    name="confirm-password" 
                    value={confirmPassword} 
                    autoComplete="off"
                    required
                    className={passwordMatch ? "" : "invalid"}
                    onChange={event => setConfirmPassword(event.target.value)} 
                    placeholder="Confirm Password"
                />

                <input type="submit" value="Sign in" />

                <h4>Already have an account? <Link to="/login">Sign in</Link></h4>
            </form>
        </div>

    )
}

export default Register;