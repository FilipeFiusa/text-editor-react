import { AiOutlineCrown } from "react-icons/ai";
import './style.css';
import DirectChat from "../../model/DirectChat";

interface DirectChatItemProps {
    userId: string;
    directChat: DirectChat;
    userClicked: (chatId: string) => void;
}

const DirectChatItem =  ({userId, directChat, userClicked}: DirectChatItemProps) => {
    const getChatName = () => {
        if(directChat && directChat.users.length === 2){
            return directChat.users[0].id !== userId ? directChat.users[0].username : directChat.users[1].username;
        }

        return "";
    }

    const isUserConnected = () => {
        if(directChat && directChat.users.length === 2){
            return directChat.users[0].id !== userId ? directChat.users[0].status : directChat.users[1].status;
        }

        return 2;
    }

    // connected ? "status online" : "status offline"

    return (
        <div className='direct-users-container' onClick={ () => userClicked(directChat.id) }>
            <div className="name-container">
                <div className='user-icon-container'>
                    <div className='user-icon'>
                        <div className={isUserConnected() == 1 ? "status online" : "status offline"}></div>
                    </div>
                    {/* <div className={connected ? "status online" : "status offline"}></div> */}
                </div>
                <h4>{ getChatName() }</h4>
            </div>

            {/* <h4>20</h4> */}
        </div>
    )
}

export default DirectChatItem;