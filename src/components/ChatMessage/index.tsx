import message from '../../model/Message';
import './style.css';

interface ChatMessageProps {
    message: message;
}

const ChatMessage =  ({message} : ChatMessageProps) => {
    return (
        <div className='message-container'>
            <div className='chat-icon-container'>
                <div className='chat-icon'></div>
            </div>
            <div className='chat-content-container'>
                <h4>{message.userName}</h4>
                <p>{message.content}</p>
            </div>
        </div>
    )
}

export default ChatMessage;