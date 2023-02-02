import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../../hooks/useAuth";
import Folder from "../../model/Folder";
import Message from "../../model/Message";
import Workspace from "../../model/Workpace";
import ChatComponent from "../ChatComponent";
import MenuFileList from '../MenuFileList';
import './style.css';

let socket = io();

interface Props {
    workspaceConnection? : WorkspaceConnection | undefined;
    currentFolder: Folder;
}

interface WorkspaceConnection {
    socket: Socket;
    workspace: Workspace
}

function WorkspaceContainer ( {workspaceConnection, currentFolder}: Props ){
    const [workspaceFolder, setWokspaceFolder] = useState(new Folder('', '', [], []));
    const [isConnected, setIsConnected] = useState(socket.connected);

    const [ currentFileName, setCurrentFileName ] = useState("");

    const [messages, setMessages] = useState<Message[]>([])

    const { auth } = useAuth();

    const [ currentContentActive, setCurrentContentActive ] = useState(2); // 0- friend list, 1- textArea, 2- chat component

    const currentContent = (c: number) => {
        if(currentContentActive == 0) {
            return <></>
        }else if(currentContentActive == 1){
            return <textarea id="page-content" onInput={onTextAreaInput} />
        }else if(currentContentActive == 2){
            return <ChatComponent messages={messages} sendMessage={sendMessage}/>
        }
            
        return <></>
    }

    const openChat = () => {
        setCurrentContentActive(2);
    }
  
    const sendMessage = (content: string) => {
        workspaceConnection?.socket.emit("send-general-message", auth?.userName, content, async (message: Message) => {
            setMessages([...messages, message]);
        });
    }

    useEffect(() => {
        const textarea = (document.getElementById("page-content") as HTMLInputElement);
        console.log("Workspace Changed");

        setCurrentFileName("");

        if(textarea)
            textarea.value = "";

        workspaceConnection?.socket.on("room-changed", content => {
            const textarea = (document.getElementById("page-content") as HTMLInputElement);
            textarea.value = content;
        })
    
        workspaceConnection?.socket.on("receive-text-changed", (text) =>{
            const textarea = (document.getElementById("page-content") as HTMLInputElement);
            textarea.value = text;
        })

        workspaceConnection?.socket.emit('get-messages', (chatMessages: any) => {
            console.log(chatMessages);
            setMessages(chatMessages);
        })

        return () => {
            workspaceConnection?.socket.off("room-changed")
            workspaceConnection?.socket.off("receive-text-changed")
           // workspaceConnection?.socket.off("new-general-message")
        };
    }, [workspaceConnection]);

    useEffect(() => {
        workspaceConnection?.socket.on('new-general-message', (newMessage: Message) => {
            console.log(messages.length);
            
            
            setMessages([
                ...messages,
                newMessage
            ]);
            
            console.log(messages);
        })
    }, [workspaceConnection, messages])

    function changeSocketRoom(roomName: string){
        setCurrentContentActive(1);
        workspaceConnection?.socket.emit("change-room", roomName);

        setCurrentFileName(roomName.replace("//", ""))
    }

    function onTextAreaInput(){
        const textarea = (document.getElementById("page-content") as HTMLInputElement);
        workspaceConnection?.socket.emit("text-changed", textarea.value);
    }
    
    return(
        <div id='workspace-container'>
            <div id='workspace-header'>
                <div>
                    <h3>Menu</h3>
                    <h3 id="current-file">{ currentFileName }</h3>
                </div>
            </div> 

            <div id='workspace-main-container'>
                <div id="menu-container">
                    <div className="chat-container" onClick={openChat}>
                        <h3> # General Chat</h3>
                    </div>

                    <hr></hr>

                    <div id="file-list">
                        <MenuFileList 
                            workspaceName={workspaceConnection?.workspace.name ? workspaceConnection?.workspace.name : "" }
                            
                            workspaceFolder={
                                workspaceConnection?.workspace.workspaceFolder ? workspaceConnection?.workspace.workspaceFolder : new Folder('', '', [], [])
                            } 
                            changeSocketRoom={changeSocketRoom} />
                    </div>
                </div>

                <div id="page-container">
                    {currentContent(currentContentActive)}
                </div>

                <div id="connected-users">
                    asdasdsad
                </div>
            </div>
        </div>
    );
}

export default WorkspaceContainer;