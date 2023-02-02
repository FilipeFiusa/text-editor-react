import { Socket } from "socket.io-client";
import Workspace from "./Workpace";

export default class SocketConnection {
    socket: Socket;
    workspace: Workspace;

    constructor (socket: Socket, workspace: Workspace){
        this.socket = socket;
        this.workspace = workspace;
    }
}