import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useAuth } from '../../../hooks/useAuth';
import { useSocket } from '../../../hooks/useSocket';
import './style.css';

interface Props {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    modalText: string;
    handleModalSubmit: (inputText: string) => any;
    modalType: string;

    folderAlreadyExists: (folderName: string) => boolean
    fileAlreadyExists: (fileName: string) => boolean
    isLanguage: (language: string) => boolean
}

const MenuListModal = ({isOpen, setIsOpen, modalText, handleModalSubmit, modalType, folderAlreadyExists, fileAlreadyExists, isLanguage}: Props) => {
    const [ textContent, seTextContent ] = useState("");
    const [ warning, setWarning ] = useState("");

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            paddingRight: '-50%',
            transform: 'translate(-50%, -50%)',
        },
        overlay: {zIndex: 1000}
    };
    
    function closeModal() {
        setIsOpen(false);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(modalType === "AddFolder" && folderAlreadyExists(textContent)){
            console.log("Folder already exists")
            setWarning("Folder already exists")
            return
        }

        if(modalType === "RenameFolder" && folderAlreadyExists(textContent)){
            console.log("Folder already exists")
            setWarning("Folder already exists")
            return
        }

        if(modalType === "AddFile" && fileAlreadyExists(textContent)){
            console.log("File already exists")
            setWarning("File already exists")
            return
        }

        if(modalType === "RenameFile" && fileAlreadyExists(textContent)){
            console.log("File already exists")
            setWarning("File already exists")
            return
        }
        
        handleModalSubmit(textContent);

        closeModal();
    }

    useEffect(() => {
        setWarning("");
    }, [isOpen])

    useEffect(() => {
        if(modalType === "AddFile" || modalType === "RenameFile"){
            if(!(textContent.split(".").length >= 2) || textContent.split(".")[textContent.split(".").length - 1] === ""){
                console.log("File has no extension")
                setWarning("File has no extension")
                return
            }else if(!isLanguage(textContent.split(".")[textContent.split(".").length - 1])){
                console.log("File has invalid extension")
                setWarning("File has invalid extension")
                return
            }else{
                setWarning("")
            }
        }
    }, [textContent])

    const renderModal = (modalType: string) => {
        if(modalType === "DeleteFolder" || modalType === "DeleteFile"){
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
                            <div className='buttons-container'>
                                <input type="button" value="Cancel"  onClick={() => {} } />
                                <input type="submit" value="Ok" />
                            </div>
                        </form>
                    </div>
                </Modal>
            );
        }else {
            return (
                <Modal
                    
                    isOpen={isOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    ariaHideApp={false}
                    contentLabel="Menu List Modal">
                    <div className='join-workspace'>
                        <h2>{modalText}</h2>
                        <form onSubmit={handleSubmit}>  
                            <h3 className='warning'>{ warning }</h3>

                            <input type="text" placeholder='' onChange={(e) => seTextContent(e.target.value)} required/>
        
                            <div className='buttons-container'>
                                <input type="button" value="Cancel"  onClick={() => {closeModal()} } />
                                <input type="submit" value="Ok" />
                            </div>
                        </form>
                    </div>
                </Modal>
            )
        }
        
    }

    return renderModal(modalType);
}   

export default MenuListModal;