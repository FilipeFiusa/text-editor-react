import { useState } from 'react';
import Modal from 'react-modal';
import { useAuth } from '../../../hooks/useAuth';
import { useSocket } from '../../../hooks/useSocket';
import './style.css';

interface Props {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void
    changeModal: (modal: number) => void
}

const JoinWorkspaceModal = ({isOpen, setIsOpen, changeModal}: Props) => {

    const [ warningText, setWarningText ] = useState("");

    const { mainConnection } = useSocket();
    const { auth } = useAuth();

    const [ invitationCode, setInvitationCode ] = useState("");

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
        
        mainConnection?.emit("join-workspace", auth?.userId, invitationCode, (status: boolean, resp: string) => {
            if(!status){
                setWarningText(resp);
                return;
            }

            setIsOpen(false);
        });
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            style={customStyles}
            ariaHideApp={false}
            contentLabel="Example Modal">
            <div className='join-workspace'>
                <h2>Join a Workspace</h2>
                <p className='warning'>{ warningText }</p>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder='Type the invitation code of the workspace' onChange={(e) => setInvitationCode(e.target.value)} required/>

                    <div className='buttons-container'>
                        <input type="button" value="Back"  onClick={() => changeModal(1)}/>
                        <input type="submit" value="Join" />
                    </div>
                </form>
            </div>
        </Modal>

    );
}   

export default JoinWorkspaceModal;