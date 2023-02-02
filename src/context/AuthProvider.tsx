import { createContext, ReactNode, useState } from "react";


interface Props {
    children?: ReactNode
}

interface IAuthContext {
    auth?: Auth
    setAuth: React.Dispatch<Auth>
  }

interface Auth {
    userId: number;
    userName: string;
    token: string;
}
export const AuthContext = createContext({} as IAuthContext);


export const AuthProvider = (props: Props) => {
    const [auth, setAuth] = useState<Auth>();

    return (
        <AuthContext.Provider value={{auth, setAuth}}>
            {props.children}
        </AuthContext.Provider>
    )
} ;


export default AuthContext;