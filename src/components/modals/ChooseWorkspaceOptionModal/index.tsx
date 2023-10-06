import Modal from 'react-modal';
import './style.css';

interface Props {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void
    changeModal: (modal: number) => void
}

const ChooseWorkspaceOptionModal = ({isOpen, setIsOpen, changeModal}: Props) => {
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

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            style={customStyles}
            ariaHideApp={false}
            contentLabel="Choose Workspace Modal">
            <div className='choose-modal-option'>
                <h2>Create or Join Workspace ?</h2>
                <form>
                    <div className='workspace-options'>
                        <input type="button" value="Create new Workspace" onClick={() => changeModal(2)}/>
                        <input type="button" value="Join a already existing one" onClick={() => changeModal(3)}/>
                    </div>
                </form>
            </div>
        </Modal>

    );
}   

export default ChooseWorkspaceOptionModal;