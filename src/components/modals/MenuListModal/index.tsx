import { useState } from 'react';
import Modal from 'react-modal';
import { useAuth } from '../../../hooks/useAuth';
import { useSocket } from '../../../hooks/useSocket';
import './style.css';

interface Props {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    modalText: string;
    handleModalSubmit: (inputText: string) => any;
}

const MenuListModal = ({isOpen, setIsOpen, modalText, handleModalSubmit}: Props) => {
    const [ textContent, seTextContent ] = useState("");

    const customStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          paddingRight: '-50%',
          transform: 'translate(-50%, -50%)',
        },
    };
    
    function closeModal() {
        setIsOpen(false);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        handleModalSubmit(textContent);

        closeModal();
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            style={customStyles}
            ariaHideApp={false}
            contentLabel="Example Modal">
            <div className='join-workspace'>
                <h2>{modalText}</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder='' onChange={(e) => seTextContent(e.target.value)} required/>

                    <div className='buttons-container'>
                        <input type="button" value="Cancel"  onClick={() => {} } />
                        <input type="submit" value="Ok" />
                    </div>
                </form>
            </div>
        </Modal>

    );
}   

export default MenuListModal;