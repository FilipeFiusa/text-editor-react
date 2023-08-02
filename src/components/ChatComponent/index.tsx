import { useEffect, useState } from 'react';
import Message from '../../model/Message';
import ChatMessage from '../ChatMessage';
import './style.css';

interface ChatComponentProps {
    messages: Message[];
    sendMessage: (content: string) => void;
}

const ChatComponent = ( {messages, sendMessage}: ChatComponentProps) => {
    //const [messages, setMessages] = useState<Message[]>([])
    const [inputContent, setInputContent] = useState("");

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            if(inputContent !== ""){
                //setMessages([ ...messages, new Message("", "alguem", inputContent)]);
                sendMessage(inputContent);
                setInputContent("");
            }
        }
    }

    useEffect(() => {
        const objDiv = document.getElementById("chat-container");
                
        if(objDiv){
            objDiv.scrollTop = objDiv.scrollHeight;
        }
    }, [messages]);

    return(
        <div key="asd" className="chat-messages-container">

            <div id="chat-container" className="messages-container">
                {messages && messages.length > 0 ? messages?.map(message => {
                    return <ChatMessage key={message.id} message={message}/>
                }) : <></>}
            </div>
            <div className="chat-input">
                <input type="text" value={inputContent} onChange={event => setInputContent(event.currentTarget.value)} onKeyDown={handleKeyDown}/>
            </div>
        </div>
    );
}

export default ChatComponent;