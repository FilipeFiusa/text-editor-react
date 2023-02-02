import './style.css';

import { useState } from 'react';
import PlusIcon from '../../icons/plus.svg';
import UsersIcon from '../../icons/users.svg';
import Workpace from '../../model/Workpace';

interface MenuItemProps {
    itemType: Number;
    onClick: (workspace: Workpace | undefined) => void;
    workspace?: Workpace
}

function MenuItem({itemType, onClick, workspace}: MenuItemProps){
    const [isSelected, setIsSelected] = useState(false);
    const [unreadiedMessages, setUnreadiedMessages] = useState(false);

    if(workspace){
        workspace.setIsSelected = () => setIsSelected( !isSelected );
    }

    return(
        <div className="menu-item" onClick={() => onClick(workspace)}>
            <div className={isSelected ? "selected" : ""}></div>

            <div className='menu-icon'>
                {itemType == 1 ? <img className="plusicon" src={UsersIcon} alt='icon' ></img> : ""}
                {itemType == 2 ? <img src={workspace ? workspace.workspaceImage : ""}></img> : ""}
                {itemType == 3 ? <img className="plusicon" src={PlusIcon} alt='icon' ></img> : ""}
            </div>
        </div>
    );
}
export default MenuItem;
