import { useContext } from "react";
import SocketProvider from "../context/SocketProvider";

export const useSocket = () => useContext(SocketProvider);