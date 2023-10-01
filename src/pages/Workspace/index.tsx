import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import MenuItem from '../../components/MenuItem';
import ChooseWorkspaceOptionModal from '../../components/modals/ChooseWorkspaceOptionModal';
import CreateWorkspaceModal from '../../components/modals/CreateWorkspaceModal';
import JoinWorkspaceModal from '../../components/modals/JoinWorkspaceModal';
import WorkspaceContainer from '../../components/WorkspaceContainer';
import { useAuth } from '../../hooks/useAuth';
import { useSocket } from '../../hooks/useSocket';
import Folder from '../../model/Folder';
import SocketConnection from '../../model/SocketConnection';
import Workspace from '../../model/Workpace';
import './style.css';
import SocialContainer from '../../components/SocialContainer';
import DirectChat from '../../model/DirectChat';
import Message from '../../model/Message';

function WorkspacePage(){
    const [modalActive, setModalActive] = useState(0);
    
    const [containerType, setContainerType] = useState("SocialContainer");

    const [chooseWorkspaceActive, setChooseWorkspaceActive] = useState(false);
    const [createWorkspaceActive, setCreateWorkspaceActive] = useState(false);
    const [joinWorkspaceActive, setJoinWorkspaceActive] = useState(false);

    const [currentWorkspace, setCurrentWorkspace] = useState<SocketConnection>();

    const [currentFolder, setCurrentFolder] = useState<Folder>(new Folder("", "", "","", [], []));

    const [isSelected, setIsSelected] = useState(false);

    const [userWorkspaces, setUserWorkspaces] = useState<Workspace[]>([]);

    const [newChatId, setNewChatId] = useState("");

    const [directChats, setDirectChats] = useState<DirectChat[]>([]);
    const [currentChat, setCurrentChat] = useState<DirectChat>();

    const { auth } = useAuth();
    const { workspacesConnections, mainConnection, setIsConnected, setMainConnection, setWorkspacesConnections } = useSocket();

    let tempWorkspace: SocketConnection[] = [];


    const friendsOnClick = () => {
        if(containerType !== "SocialContainer"){
            setContainerType("SocialContainer")
        }
    }

    const workspaceOnClick = (workspace: Workspace | undefined) => {
        if(containerType !== "WorkspaceContainer"){
            setContainerType("WorkspaceContainer")
        }

        if(workspace != undefined){
            for(let workspaceConnection of workspacesConnections){
                if(workspaceConnection.workspace.inviteCode === workspace.inviteCode){
                    setCurrentWorkspace(workspaceConnection);
                    setCurrentFolder(workspaceConnection.workspace.workspaceFolder);
                }
            }
        }
    }

    const newWorkspaceOnClick = () => {
        setChooseWorkspaceActive(true);
        setModalActive(1)
    }

    const changeModal = (modal: number) => {
        setModalActive(modal);
    }

    const loadWorkspaceSockets = (userWorkspaces: Workspace[]) => {
        userWorkspaces.forEach( (workspace) => {
            const workspaceSocketInstance = io("http://localhost:3333/" + workspace.inviteCode);

            workspaceSocketInstance.on("connect", () => {

                workspaceSocketInstance.emit("auth", auth?.userId, () => {
                    workspaceSocketInstance.emit('initialize', async (folders: any) => {
                        workspace.workspaceFolder = folders;
    
                        tempWorkspace.push(new SocketConnection(workspaceSocketInstance, workspace));
    
                        if(tempWorkspace.length === userWorkspaces.length){
                            setWorkspacesConnections(tempWorkspace)
                            addListenersToConnections()
                        }
                    })
                })
            })
        })
    }

    const addListenersToConnections = () => {
        console.log(tempWorkspace.length)
        console.log(workspacesConnections.length)
        for (const workspaceConnection of tempWorkspace) {
            console.log("adding event listeners")
            console.log("--------");
            

            console.log(currentWorkspace)
            workspaceConnection.socket.on("file-list-updated", (updatedFolder) => {
                console.log(workspaceConnection.workspace)
                console.log(updatedFolder)
                console.log(currentWorkspace?.workspace.name)
                console.log(workspaceConnection.workspace.name)
                console.log("updating")
                workspaceConnection.workspace.workspaceFolder = updatedFolder;
            })   
        }
    }

    const goToDirectChat = (roomName: string) => {
        setNewChatId(roomName);
        setContainerType("SocialContainer")
    }

    useEffect(() => {
        switch (modalActive) {
            case 0:
                setChooseWorkspaceActive(false);
                setCreateWorkspaceActive(false);
                setJoinWorkspaceActive(false);
                setModalActive(0);
                break;
            case 1:
                setChooseWorkspaceActive(true);
                setCreateWorkspaceActive(false);
                setJoinWorkspaceActive(false);
                break;
            case 2:
                setChooseWorkspaceActive(false);
                setCreateWorkspaceActive(true);
                setJoinWorkspaceActive(false);
                break;
            case 3:
                setChooseWorkspaceActive(false);
                setCreateWorkspaceActive(false);
                setJoinWorkspaceActive(true);
                break;
        }
    }, [modalActive])

    useEffect(() => {
        const connection = io("http://localhost:3333");

        setMainConnection(connection);
     
        connection.on('connect', () => {
            setIsConnected(false);
            connection.emit("user-authentication", auth?.userId);
        });

        connection.on('disconnect', () => {
            setIsConnected(false);
        });

        connection.prependAny((eventName, ...args) => {
            console.log("prepend")
            console.log(eventName)
        });

        connection.on('user-workspaces', userWorkspaces => {
            setUserWorkspaces(userWorkspaces);

            loadWorkspaceSockets(userWorkspaces);
        })

        connection.on('new-user-workspace', newWorkspace => {
            console.log(userWorkspaces)
            console.log(newWorkspace)

            const workspaceSocketInstance = io("http://localhost:3333/" + newWorkspace.inviteCode);
        
            workspaceSocketInstance.on("connect", () => {
                console.log(workspaceSocketInstance.id + " connected on " + newWorkspace.name)

                workspaceSocketInstance.emit("auth", auth?.userId, () => {
                    workspaceSocketInstance.emit('initialize', (folders: any) => {
                        console.log(newWorkspace.inviteCode + ": ");
                        newWorkspace.workspaceFolder = folders;
                        console.log(newWorkspace.workspaceFolder);
    
                        setWorkspacesConnections([...workspacesConnections, new SocketConnection(workspaceSocketInstance, newWorkspace)])
                        
                    })
                })
            });

            setUserWorkspaces((userWorkspaces) => [
                newWorkspace,
                ...userWorkspaces
            ]);


                
        })

        connection.on("user-direct-messages", (_directChats: DirectChat[]) => {
            console.log("starting direct chat")

            console.log(_directChats)

            if(!_directChats){
                return
            }

            setDirectChats(_directChats)
        })

        connection.on("new-user-direct-messages", (_directChats: DirectChat) => {
            if(!_directChats){
                return
            }
            
            console.log("------------------------")
            console.log(_directChats)
            
            setDirectChats(current => [...current, _directChats])
        })
        
        connection.on("user-connected", (chatId: string, connectUserId: string) => {
            setDirectChats(currentDirectChat => currentDirectChat.map((chat) => {
                if(chat.id === chatId){
                    return {
                        ...chat,
                        users: chat.users.map((user) => {
                            if(user.id === connectUserId){
                                return {
                                    ...user,
                                    status: 1
                                }
                            }

                            return user
                        })
                    }
                }
                
                return chat;
            })); 
        })

        connection.on("user-disconnected", (chatId: string, connectUserId: string) => {
            setDirectChats(currentDirectChat => currentDirectChat.map((chat) => {
                if(chat.id === chatId){
                    return {
                        ...chat,
                        users: chat.users.map((user) => {
                            if(user.id === connectUserId){
                                return {
                                    ...user,
                                    status: 2
                                }
                            }

                            return user
                        })
                    }
                }
                
                return chat;
            })); 
        })

        connection.on("new-direct-message", (chatId: string, newMessage: Message) => {
            setDirectChats(currentDirectChat => currentDirectChat.map((chat) => {
                if(chat.id === chatId){
                    return {
                        ...chat,
                        messages: [...chat.messages, newMessage]
                    }
                }
                
                return chat;
            })); 

            console.log(directChats)

            console.log("chat updated +++") 
            // console.log(currentChat)
        })

        return () => {
            connection.off('connect');
            connection.off('disconnect');
            connection.off('user-workspaces');
            connection.off('new-user-workspace');
            connection.off("direct-chat-changed");
            connection.off("new-direct-message");
            connection.off("user-disconnected");
        };
    }, [])

    useEffect(() => {
        if(!mainConnection) {
            return
        }

        mainConnection.on("new-current-direct-message", (chatId: string, newMessage: Message) => {
            console.log("new message")
            console.log(currentChat)

            if(currentChat && currentChat.id == chatId){
                setCurrentChat({
                    ...currentChat,
                    messages: [...currentChat.messages, newMessage]
                })
            }

            console.log("chat updated +++") 
            console.log(currentChat)
        })



        return () => {
            mainConnection.off("new-current-direct-message")
        }
    }, [currentChat])

    useEffect(() => {
        console.log("----------")
        console.log(directChats)
    }, [directChats])

    return( 
        <div id="main-page">
            <div className='side-menu'>
                <MenuItem key={0} itemType={1} onClick={friendsOnClick} />
                <hr></hr>

                {
                    userWorkspaces.map((workspace) => {
                        return <MenuItem key={workspace.id} itemType={2} workspace={workspace} onClick={workspaceOnClick}/>
                    })
                }
                
                <MenuItem itemType={3} onClick={newWorkspaceOnClick}/>
            </div>

            { containerType === "SocialContainer" 
                ? <SocialContainer mainConnection={mainConnection} directChats={directChats} currentChat={ currentChat } setCurrentChat={setCurrentChat} /> 
                : <WorkspaceContainer currentFolder={currentFolder} setCurrentFolder={setCurrentFolder} workspaceConnection={currentWorkspace} goToDirectChat={goToDirectChat}  />}

            {/* <div id="content-container">
                <SocialContainer />
            </div> */}
            {/* <WorkspaceContainer currentFolder={currentFolder} setCurrentFolder={setCurrentFolder} workspaceConnection={currentWorkspace} /> */}

            <ChooseWorkspaceOptionModal isOpen={chooseWorkspaceActive} setIsOpen={setChooseWorkspaceActive} changeModal={changeModal} />
            <CreateWorkspaceModal isOpen={createWorkspaceActive} setIsOpen={setCreateWorkspaceActive} changeModal={changeModal}/>
            <JoinWorkspaceModal isOpen={joinWorkspaceActive} setIsOpen={setJoinWorkspaceActive} changeModal={changeModal}/>
        </div>
    );
}

export default WorkspacePage;