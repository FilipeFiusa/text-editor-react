import { useState } from 'react';
import MenuListModal from '../modals/MenuListModal';
import './style.css';
import Folder from '../../model/Folder';
import File from '../../model/File';


interface FileContextMenuProps{
    x: number;
    y: number;
    file: File;

    openModalFile: (modalText: string, menuType: string, file?: File) => any;
}

const FileContextMenu = ({x, y, file, openModalFile} : FileContextMenuProps) => {
    const menuPosition = {
        top: y,
        left: x
    }

    const handleRenameClick = () => {
        openModalFile("Type the new file's name", "RenameFile", file)
    }

    const handleDeleteClick = () => {
        openModalFile("Are you sure you want to delete file ?", "DeleteFile", file)
    }
    
    return (
        <div className='folder-context-menu' style={menuPosition} >
            <ul>
                <li onClick={() => handleRenameClick()}>Rename</li>
                <li onClick={() => handleDeleteClick()}>Delete</li>
            </ul>
        </div>
    );
}

export default FileContextMenu;