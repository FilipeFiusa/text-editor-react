import { AiOutlineCrown } from "react-icons/ai";
import './style.css';

interface ConnectedUserProps{
    user: ConnectedUserProps
}

interface ConnectedUser {
    connected: boolean;
    user: WorkspaceUser;
}

interface WorkspaceUser {
    username: string;
    userId: number;
}

const ConnectedUserComponent =  ({connected, user} : ConnectedUser) => {
    return (
        <div className='connected-users-container'>
            <div className='user-icon-container'>
                <div className='user-icon'>
                </div>
                <div className={connected ? "status online" : "status offline"}></div>
            </div>
            <h4>{user.username}</h4>
            
            <AiOutlineCrown size={20} />
        </div>
    )
}

export default ConnectedUserComponent;