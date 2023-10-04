import { useEffect, useState } from 'react';
import ChatComponent from '../ChatComponent';
import './style.css';
import Message from '../../model/Message';
import DirectUser from '../DirectChatItem';
import DirectChat from '../../model/DirectChat';
import { useAuth } from '../../hooks/useAuth';
import DirectChatItem from '../DirectChatItem';
import { Socket } from 'socket.io-client';
import UsersIcon from '../../icons/users.svg';

interface SocialContainerProps {
    mainConnection?: Socket 
    
    directChats: DirectChat[];
    currentChat: DirectChat | undefined;
    setCurrentChat: (directChat: DirectChat) => void
    
}

function SocialContainer ({mainConnection, directChats, currentChat, setCurrentChat} : SocialContainerProps){
    const { auth } = useAuth();
    const [messages, setMessages] = useState<Message[]>([])

    const sendMessage =  (message: string) => {
        mainConnection?.emit("send-direct-message", currentChat?.id, message, async (message: Message) => {
            setMessages([...messages, message]);
        });
    }

    const userClicked = (chatId: string) => {
        console.log("clicked")

        for(let c of directChats){
            if(c.id === chatId){
                setCurrentChat(c);
                console.log(currentChat)
            }
        }
    }

    const getChatName = () => {
        if(currentChat && currentChat.users.length === 2){
            return currentChat.users[0].id !== auth?.userId ? currentChat.users[0].username : currentChat.users[1].username;
        }

        return "";
    }

    useEffect(() => {
        console.log(currentChat)
    }, [currentChat])

    return (
        <div className="social-container">
            <div className='social-header'>
                <div className="left">
                    <h3>Direct Message</h3>
                </div>

                <div className="right">
                    <div className="receiving-user-container">
                        {/* <img /> */}
                        <h3 id="current-file">{ getChatName() }</h3>
                    </div>
                </div>
            </div> 

            <div className='social-main-container'>
                <div className="social-menu-container">
                    <div className="direct-users-list">

                        { directChats && auth ? directChats.map((chat) => {
                            return <DirectChatItem key={chat.id} userId={auth?.userId} directChat={chat} userClicked={userClicked} />
                        }) : "" }
                    </div>

                    <div className="user-profile">
                        <div className="name-container">
                            <div className='user-icon-container'>
                                <div className='user-icon'>
                                    <div className={"status offline"}></div>
                                </div>
                                {/* <div className={connected ? "status online" : "status offline"}></div> */}
                            </div>
                            <h4>Nome</h4>
                        </div>

                        <h1>e</h1>
                    </div>
                </div>

                <div id="page-container">
                    <ChatComponent messages={currentChat?.messages ? currentChat?.messages : [] } sendMessage={sendMessage} />
                </div>
            </div>
        </div>
    )
}

export default SocialContainer;