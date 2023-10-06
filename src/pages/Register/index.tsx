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


                <div className="input-div">
                    <label htmlFor="login">
                        Login:
                    </label>
                    <input 
                        type="text"
                        id="login" 
                        value={login} 
                        autoComplete="off"
                        required
                        onChange={event => setLogin(event.target.value)} 
                        placeholder="Login" 
                    />
                </div>

                <div className="input-div">
                    <label htmlFor="email">
                        Email:
                    </label>
                    <input 
                        id="email"          
                        autoComplete="off"
                        required
                        className={emailValid ? "" : "invalid"}
                        onChange={event => setEmail(event.target.value)} 
                        placeholder=""
                    />
                </div>

                <div className="input-div">
                    <label htmlFor="password">
                        Password:
                    </label>
                    <input 
                        type={"password"} 
                        id="password" 
                        value={password} 
                        autoComplete="off"
                        required
                        className={passwordMatch ? "" : "invalid"}
                        onChange={event => setPassword(event.target.value)} 
                        placeholder=""
                    />
                </div>

                <div className="input-div">
                    <label htmlFor="confirm-password">
                        Confirm Password:
                    </label>
                    
                    <input 
                        type={"password"} 
                        id="confirm-password" 
                        value={confirmPassword} 
                        autoComplete="off"
                        required
                        className={passwordMatch ? "" : "invalid"}
                        onChange={event => setConfirmPassword(event.target.value)} 
                        placeholder=""
                    />
                </div>





                <input className="submit-button" type="submit" value="Register" />

                <h4><Link to="/login">Already have an account? </Link></h4>
            </form>
        </div>

    )
}

export default Register;