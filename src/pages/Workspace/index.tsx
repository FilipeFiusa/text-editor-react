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

function WorkspacePage(){
    const [modalActive, setModalActive] = useState(0);

    const [chooseWorkspaceActive, setChooseWorkspaceActive] = useState(false);
    const [createWorkspaceActive, setCreateWorkspaceActive] = useState(false);
    const [joinWorkspaceActive, setJoinWorkspaceActive] = useState(false);

    const [currentWorkspace, setCurrentWorkspace] = useState<SocketConnection>();

    const [currentFolder, setCurrentFolder] = useState<Folder>(new Folder("", "", [], []));

    const [isSelected, setIsSelected] = useState(false);

    const [userWorkspaces, setUserWorkspaces] = useState<Workspace[]>([]);

    const { auth } = useAuth();
    const { workspacesConnections, setIsConnected, setMainConnection, setWorkspacesConnections } = useSocket();

    let tempWorkspace: SocketConnection[] = [];


    const friendsOnClick = () => {
        console.log("Friends clicked");
    }

    const workspaceOnClick = (workspace: Workspace | undefined) => {
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
                            console.log("finished")

                            console.log(tempWorkspace.length);
                            console.log(workspacesConnections.length);
                            
                            setWorkspacesConnections(tempWorkspace)
                            
                            // await timeout(3000);

                            // console.log(tempWorkspace.length);
                            // console.log(workspacesConnections.length);

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

    const timeout = (delay: number) => {
        return new Promise( res => setTimeout(res, delay) );
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

        return () => {
            connection.off('connect');
            connection.off('disconnect');
            connection.off('user-workspaces');
            connection.off('new-user-workspace');
        };
    }, [])

    // useEffect(() => {
    //     console.log("updated");
    //     console.log(workspacesConnections.length);
        
    //     addListenersToConnections();
        
    //     return () => {
    //         addListenersToConnections();
    //     }
    // }, [workspacesConnections])

    return( 
        <div id="main-page">
            <div className='side-menu'>
                <MenuItem itemType={1} onClick={friendsOnClick} />
                <hr></hr>

                {
                    userWorkspaces.map((workspace) => {
                        return <MenuItem key={workspace.id} itemType={2} workspace={workspace} onClick={workspaceOnClick}/>
                    })
                }
                
                <MenuItem itemType={3} onClick={newWorkspaceOnClick}/>
            </div>

            <div id="content-container">
                <WorkspaceContainer currentFolder={currentFolder} setCurrentFolder={setCurrentFolder} workspaceConnection={currentWorkspace} />
            </div>

            <ChooseWorkspaceOptionModal isOpen={chooseWorkspaceActive} setIsOpen={setChooseWorkspaceActive} changeModal={changeModal} />
            <CreateWorkspaceModal isOpen={createWorkspaceActive} setIsOpen={setCreateWorkspaceActive} changeModal={changeModal}/>
            <JoinWorkspaceModal isOpen={joinWorkspaceActive} setIsOpen={setJoinWorkspaceActive} changeModal={changeModal}/>
        </div>
    );
}

export default WorkspacePage;