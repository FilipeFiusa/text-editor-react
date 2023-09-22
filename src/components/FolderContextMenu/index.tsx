import { useState } from 'react';
import MenuListModal from '../modals/MenuListModal';
import './style.css';
import Folder from '../../model/Folder';


interface FolderContextMenuProps{
    x: number;
    y: number;
    folder: Folder;

    openModal: (modalText: string, menuType: string, folder?: Folder) => any;
}

const FolderContextMenu = ({x, y, folder, openModal} : FolderContextMenuProps) => {
    const menuPosition = {
        top: y,
        left: x
    }

    const handleAddFolderClick = () => {
        openModal("Type the new folder's name", "AddFolder", folder)
    }

    const handleAddFileClick = () => {
        openModal("Type the new file's name", "AddFile", folder)
    }

    const handleRenameClick = () => {
        openModal("Type the new folder's name", "RenameFolder", folder)
    }

    const handleDeleteClick = () => {
        openModal("Are you sure you want do delete folder ?", "DeleteFolder", folder)
    }
    
    return (
        <div className='folder-context-menu' style={menuPosition} >
            <ul>
                <li onClick={() => handleAddFolderClick()}>Add Folder</li>
                <li onClick={() => handleAddFileClick()}>Add File</li>
                <li onClick={() => handleRenameClick()}>Rename</li>
                <li onClick={() => handleDeleteClick()}>Delete</li>
            </ul>
        </div>
    );
}

export default FolderContextMenu;