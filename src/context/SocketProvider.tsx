import { createContext, ReactNode, useState } from "react";
import { Socket } from "socket.io-client";
import SocketConnection from "../model/SocketConnection";


interface Props {
    children?: ReactNode
}

interface ISocketContext {
    isConnected: boolean;
    mainConnection?: Socket;
    workspacesConnections: SocketConnection[];

    setIsConnected: React.Dispatch<boolean>;
    setMainConnection: React.Dispatch<Socket>;
    setWorkspacesConnections: React.Dispatch<SocketConnection[]>;
}

export const SocketContext = createContext({} as ISocketContext);


export const SocketProvider = (props: Props) => {
    const [isConnected, setIsConnected] = useState(false);
    const [mainConnection, setMainConnection] = useState<Socket>();
    const [workspacesConnections, setWorkspacesConnections] = useState<SocketConnection[]>([]);

    return (
        <SocketContext.Provider value={{
                mainConnection, 
                workspacesConnections, 
                isConnected,
                setMainConnection, 
                setWorkspacesConnections,
                setIsConnected
        }}>
            {props.children}
        </SocketContext.Provider>
    )
} ;


export default SocketContext;