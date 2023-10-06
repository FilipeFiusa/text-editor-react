import { AxiosError } from "axios";
import { useState } from "react";
import { useCookies } from "react-cookie";
import axios from "../../api/axios";
import "./style.css";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function Login(){
    let navigate = useNavigate();

    const { setAuth } = useAuth();

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [cookies, setCookie, removeCookie] = useCookies(['userToken']);


    async function handleSubmit(event: React.FormEvent<HTMLFormElement>){
        event.preventDefault();
        const warningElement = (document.getElementById("warning") as HTMLElement);

        console.log(login)
        console.log(password)

        try{
            const response = await axios.post("/login", {login, password});
        
            if(response.status === 200) {
                const token = response.data.token;
                const userId = response.data.userId;
                const userName = response.data.userName;

                console.log("userName: " + userName);

                setAuth({userId, userName, token})

                //navigate("/");

                setCookie("userToken", response.data.token,  {secure: true, sameSite: 'none'});
                window.location.href = "/";
            }
        }catch (err) {
            const error = err as AxiosError
            if(!error.response){
                console.log(error.response)
                console.log("No server response")
            }else if(error.response.status === 400 ){
                console.log("UserName or password is wrong");
            }
            
        }
    }

    return (
        <div id="login-container">
            <form onSubmit={handleSubmit} id="login-form">
                <h2>Login</h2>

                <p id="warning"></p>
                <div className="input-div">
                    <label htmlFor="login">
                        Login:
                    </label>
                    <input id="login" value={login} onChange={event => setLogin(event.target.value)} placeholder="" />
                </div>
                <div className="input-div">
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" value={password} onChange={event => setPassword(event.target.value)} placeholder=""/>
                </div>
                

                <input className="submit-button" type="submit" value="Sign in" />

                <h4>Still dont have an account? <Link to="/register">Sign up</Link></h4>
            </form>
        </div>
    )
}

export default Login;