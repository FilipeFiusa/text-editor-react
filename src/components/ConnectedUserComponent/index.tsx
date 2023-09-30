import { AiOutlineCrown } from "react-icons/ai";
import './style.css';
import { useAuth } from "../../hooks/useAuth";

interface ConnectedUserProps {
    connected: boolean;
    user: WorkspaceUser;
    isLeader: boolean;

    createDirectMessage: (receivingUserId: string) => void;
}

interface WorkspaceUser {
    username: string;
    id: string;
    
}

const ConnectedUserComponent =  ({connected, user, isLeader, createDirectMessage} : ConnectedUserProps) => {   
    return (
        <div onClick={ () => { createDirectMessage(user.id) } } className='connected-users-container'>
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