import { useState } from 'react';
import ChatComponent from '../ChatComponent';
import './style.css';
import Message from '../../model/Message';
import DirectUser from '../DirectUser';

function SocialContainer (){
    const [messages, setMessages] = useState<Message[]>([])

    const sendMessage =  () => {

    }

    return (
        <div className='social-container'>
            <div className='social-header'>
                <div className="left">
                    <h3>Direct Message</h3>
                </div>

                <div className="right">
                    <div className="receiving-user-container">
                        {/* <img /> */}
                        <h3 id="current-file">Sender name</h3>
                    </div>
                </div>
            </div> 

            <div className='social-main-container'>
                <div className="social-menu-container">
                    <div className="direct-users-list">

                        <DirectUser />
                        <DirectUser />
                        <DirectUser />
                        <DirectUser />

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
                    <ChatComponent messages={messages} sendMessage={sendMessage} />
                </div>
            </div>
        </div>
    )
}

export default SocialContainer;