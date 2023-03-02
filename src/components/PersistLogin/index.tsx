import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Outlet } from "react-router-dom";
import axios from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";
import Loading from "../Loading";


const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { auth, setAuth } = useAuth();

    const [cookies, setCookie, removeCookie] = useCookies(['userToken']);

    useEffect(() => {
        const verifyToken = async () => {
            await timeout(1000); //for 1 sec delay

            try {
                const response = await axios.post("/session", {
                    token: cookies.userToken
                })

                if(response.status === 200){
                    console.log(response.data)

                    setAuth({
                        userId: response.data.decoded.userId, 
                        userName: response.data.decoded.userName,
                        token: cookies.userToken
                    })
                    setIsLoading(false);
                }
            }catch(err){
                console.log(err);
                console.log("deu ruim");
            }finally{
                setIsLoading(false);
            }
        }

        function timeout(delay: number) {
            return new Promise( res => setTimeout(res, delay) );
        }
        

        !auth?.token ? verifyToken() : setIsLoading(false);
    }, []);

    return(
        <>
            {
                isLoading
                    ? <Loading />
                    : <Outlet />
            }
        </>

    );
}

export default PersistLogin;