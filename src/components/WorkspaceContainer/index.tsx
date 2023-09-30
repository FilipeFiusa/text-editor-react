import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../../hooks/useAuth";
import Folder from "../../model/Folder";
import Message from "../../model/Message";
import Workspace from "../../model/Workpace";
import ChatComponent from "../ChatComponent";
import ConnectedUserComponent from "../ConnectedUserComponent";
import MenuFileList from '../MenuFileList';
import FileIcon from "../../icons/file.svg";
import UsersIcon from '../../icons/users.svg';
import './style.css';

let socket = io();

interface Props {
    workspaceConnection? : WorkspaceConnection | undefined;
    currentFolder: Folder;
    setCurrentFolder: Function;
    goToDirectChat: (roomName: string) => void;
}

interface WorkspaceConnection {
    socket: Socket;
    workspace: Workspace
}

interface ConnectedUser {
    connected: boolean;
    user: WorkspaceUser;
    isLeader: boolean
}

interface WorkspaceUser {
    username: string;
    id: string;

}

function WorkspaceContainer ( {workspaceConnection, currentFolder, setCurrentFolder, goToDirectChat}: Props ){
    const [workspaceFolder, setWorkspaceFolder] = useState<Folder>();
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [isConnectedUserActive, setIsConnectedUserActive] = useState(false);

    const [connectedUsers, setConnectedUsers] = useState<ConnectedUser[]>([]);

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
        setCurrentFileName("General Chat")
    }
  
    const sendMessage = (content: string) => {
        workspaceConnection?.socket.emit("send-general-message", auth?.userName, content, async (message: Message) => {
            setMessages([...messages, message]);
        });
    }

    useEffect(() => {
        const textarea = (document.getElementById("page-content") as HTMLInputElement);

        setWorkspaceFolder(workspaceConnection?.workspace.workspaceFolder);

        setCurrentFileName("");

        if(textarea)
            textarea.value = "";

        
        // workspaceConnection?.socket.emit("auth", auth?.userId, () => {
        //     console.log("authing")
            
        workspaceConnection?.socket.emit("get-users", (currentConnectedUsers: ConnectedUser[]) => {
            setConnectedUsers(currentConnectedUsers); 
            console.log(currentConnectedUsers)
        })

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

        workspaceConnection?.socket.on("file-list-updated-specific", (updatedFolder) => {
            setCurrentFolder(updatedFolder);
        })

        return () => {
            workspaceConnection?.socket.off("room-changed")
            workspaceConnection?.socket.off("get-users")
            workspaceConnection?.socket.off("receive-text-changed")
           // workspaceConnection?.socket.off("new-general-message")
        };
    }, [workspaceConnection]);

    useEffect(() => {
        workspaceConnection?.socket.on("users-changed", (currentConnectedUsers: ConnectedUser[]) => {
            console.log("users changed")
            setConnectedUsers(currentConnectedUsers);
        })

        workspaceConnection?.socket.on("direct-chat-created", (roomName: string) => {
            console.log(roomName)
            goToDirectChat(roomName)
        })
        
        return () => {
            workspaceConnection?.socket.off("users-changed")
            workspaceConnection?.socket.off("direct-chat-created")
        };
    }, [workspaceConnection])

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

    const changeSocketRoom = (roomName: string) => {
        setCurrentContentActive(1);
        workspaceConnection?.socket.emit("change-room", roomName);

        setCurrentFileName(roomName.replace("//", ""))
    }

    const onTextAreaInput = () => {
        const textarea = (document.getElementById("page-content") as HTMLInputElement);
        workspaceConnection?.socket.emit("text-changed", textarea.value);
    }

    const addFolder = (newFolderName: string, folder: string) => {
        workspaceConnection?.socket.emit("add-folder", newFolderName, folder);
    }

    const addFile = (newFileName: string, folder: string) => {
        workspaceConnection?.socket.emit("add-file", newFileName, folder);
    }

    const renameFolder = (newFolderName: string, folder: string) => {
        workspaceConnection?.socket.emit("rename-folder", newFolderName, folder);
    }

    const deleteFolder = (folder: string) => {
        workspaceConnection?.socket.emit("delete-folder", folder);
    }

    const renameFile = (parentId: string, newFileName: string, fileId: string) => {
        workspaceConnection?.socket.emit("rename-file", parentId, newFileName, fileId);
    }
    
    const deleteFile = (parentId: string, fileId: string) => {
        workspaceConnection?.socket.emit("delete-file", parentId, fileId);
    }

    const toggleConnectedUsers = () => {
        setIsConnectedUserActive(!isConnectedUserActive)
    }

    const createDirectMessage = (receivingUserId: string) => {
        if(auth?.userId === receivingUserId) {
            return
        }

        workspaceConnection?.socket.emit("start-direct-chat", receivingUserId);
    }
    
    return(
        <div id='workspace-container'>
            <div id='workspace-header'>
                <div className="left">
                    <h3>Server code: {workspaceConnection?.workspace.inviteCode}</h3>
                </div>

                <div className="right">
                    <div className="current-file-title">
                        <img src={currentFileName && currentFileName !== "General Chat" ? FileIcon : ""} alt="" />
                        <h3 id="current-file">{ currentFileName ? currentFileName : "General Chat" }</h3>
                    </div>

                    <img className="user-icon" onClick={toggleConnectedUsers} src={UsersIcon} alt="" />
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
                                currentFolder ? currentFolder : new Folder('', '/', '', '', [], [])
                            } 
                            changeSocketRoom={changeSocketRoom} 
                            
                            addFolder={addFolder}
                            addFile={addFile}
                            renameFolder={renameFolder}
                            deleteFolder={deleteFolder}
                            renameFile={renameFile}
                            deleteFile={deleteFile}
                            />
                    </div>
                </div>

                <div id="page-container">
                    {currentContent(currentContentActive)}
                </div>

                <div className={ isConnectedUserActive ? "" : "hide" } id="connected-users">
                    {connectedUsers.map(user => {
                        return <ConnectedUserComponent createDirectMessage={createDirectMessage} key={user.user.id} connected={user.connected} user={user.user} isLeader={user.isLeader} />
                    })}
                </div>
            </div>
        </div>
    );
}

export default WorkspaceContainer;