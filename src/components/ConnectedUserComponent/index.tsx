import { AiOutlineCrown } from "react-icons/ai";
import './style.css';

interface ConnectedUserProps{
    user: ConnectedUserProps
    isLeader: boolean
}

interface ConnectedUser {
    connected: boolean;
    user: WorkspaceUser;
    isLeader: boolean
}

interface WorkspaceUser {
    username: string;
    userId: number;
    
}

const ConnectedUserComponent =  ({connected, user, isLeader} : ConnectedUser) => {
    console.log(isLeader)

    return (
        <div className='connected-users-container'>
            <div className='user-icon-container'>
                <div className='user-icon'>
                </div>
                <div className={connected ? "status online" : "status offline"}></div>
            </div>
            <h4>{user.username}</h4>
            
            {isLeader ? <AiOutlineCrown size={20} /> : ""}
        </div>
    )
}

export default ConnectedUserComponent;