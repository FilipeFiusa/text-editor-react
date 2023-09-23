import { AiOutlineCrown } from "react-icons/ai";
import './style.css';

const DirectUser =  () => {
    return (
        <div className='direct-users-container'>
            <div className="name-container">
                <div className='user-icon-container'>
                    <div className='user-icon'>
                        <div className={"status offline"}></div>
                    </div>
                    {/* <div className={connected ? "status online" : "status offline"}></div> */}
                </div>
                <h4>User</h4>
            </div>

            <h4>20</h4>
        </div>
    )
}

export default DirectUser;