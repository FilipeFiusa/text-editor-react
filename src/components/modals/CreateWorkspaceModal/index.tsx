import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import './style.css';

import { useAuth } from '../../../hooks/useAuth';
import { useSocket } from '../../../hooks/useSocket';
import PlusIcon from '../../../icons/plus.svg';

interface Props {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void
    changeModal: (modal: number) => void
}

const CreateWorkspaceModal = ({isOpen, setIsOpen, changeModal}: Props) => {
    const { mainConnection } = useSocket();
    const { auth } = useAuth();

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
    
    const [workspaceName, setWorkspaceName] = useState("")
    const [selectedFile, setSelectedFile] = useState<any>()
    const [preview, setPreview] = useState<string>()

    function closeModal() {
        setIsOpen(false);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const extension = selectedFile?.name.split(".")[1]

        mainConnection?.emit("create-workspace", auth?.userId, workspaceName, selectedFile, extension, (status: boolean) => {
            if(!status){
                console.log("deu ruim")
                return;
            }

            setIsOpen(true);
        });
    }

    const onFileSelected = (event: React.FormEvent<HTMLInputElement>) => {
        console.log(event.currentTarget.files);
        if(event.currentTarget.files && event.currentTarget.files.length > 0 && event.currentTarget.files.item(0)){
            setSelectedFile(event.currentTarget.files.item(0));
        }
    }
      
    // create a preview as a side effect, whenever selected file is changed
    useEffect(() => {
        if (!selectedFile) {
            setPreview(undefined)
            return
        }

        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])
      

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            style={customStyles}
            ariaHideApp={false}
            contentLabel="Example Modal">
            <div className='create-workspace'>
                <h2>Create Your Workspace</h2>
                <form onSubmit={handleSubmit}>
                    <div className='upload-container'>
                        <div className={selectedFile ? "image" : "image placeholder"}>
                            <img src={selectedFile ? preview : PlusIcon} alt="" />
                            <input         
                                type="file" 
                                multiple={false}
                                accept="image/*"
                                required
                                onChange={onFileSelected} />
                        </div>
                    </div>
                    
                    <input 
                        type="text" 
                        required 
                        placeholder='Type the name of your new workspace'
                        onChange={event => setWorkspaceName(event.target.value)}/>

                    <div className='buttons-container'>
                        <input type="button" value="Back"  onClick={() => changeModal(1)}/>
                        <input type="submit" value="Create" required />
                    </div>
                </form>
            </div>
        </Modal>

    );
}   

export default CreateWorkspaceModal;