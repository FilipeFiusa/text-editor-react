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
        
            console.log(workspaceSocketInstance)
            workspaceSocketInstance.on("connect", () => {
                console.log(workspaceSocketInstance.id + " connected on " + workspace.name)

                workspaceSocketInstance.emit('get-folders', (folders: any) => {
                    console.log(workspace.inviteCode + ": ");
                    workspace.workspaceFolder = folders;
                    console.log(workspace.workspaceFolder);

                    tempWorkspace.push(new SocketConnection(workspaceSocketInstance, workspace));

                    if(tempWorkspace.length === userWorkspaces.length){
                        setWorkspacesConnections([...tempWorkspace])
                    }
                })
            })
        })
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

        console.log("Main connection", connection.id)
     
        connection.on('connect', () => {
            setIsConnected(false);
            connection.emit("user-authentication", auth?.userId);
        });

        connection.on('disconnect', () => {
            setIsConnected(false);
        });

        connection.on('user-workspaces', userWorkspaces => {
            setUserWorkspaces(userWorkspaces);

            console.log(userWorkspaces)

            loadWorkspaceSockets(userWorkspaces);
        })

        connection.on('new-user-workspace', newWorkspace => {
            console.log(userWorkspaces)
            console.log(newWorkspace)

            setUserWorkspaces([
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
                <WorkspaceContainer currentFolder={currentFolder} workspaceConnection={currentWorkspace} />
            </div>

            <ChooseWorkspaceOptionModal isOpen={chooseWorkspaceActive} setIsOpen={setChooseWorkspaceActive} changeModal={changeModal} />
            <CreateWorkspaceModal isOpen={createWorkspaceActive} setIsOpen={setCreateWorkspaceActive} changeModal={changeModal}/>
            <JoinWorkspaceModal isOpen={joinWorkspaceActive} setIsOpen={setJoinWorkspaceActive} changeModal={changeModal}/>
        </div>
    );
}

export default WorkspacePage;