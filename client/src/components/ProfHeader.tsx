import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import type {RootState} from '../store/store';
import {setOpen, logoutSlice} from '../store/slice/profHeader';
import Swal from 'sweetalert2';
import '../assets/css/ProfHeader.css';
import Icon from '../assets/images/Logo-removebg-preview.png';

function ProfHeader() {
  const navigate = useNavigate();  
  const dispatch = useDispatch();
  const classUsersName = localStorage.getItem('classUsersName');
  const open = useSelector((state: RootState) => state.profHeader.open);
  const classUsersImage = localStorage.getItem('classUsersImage');

  const toggleMenu = () => dispatch(setOpen(!open));

  const manageProfile = async () => {
    navigate('/ProfManageAcc');
  }

  const logout = async () => {
    Swal.fire({
        title:'Are You Sure?',
        text:'Do you want to logout?',
        icon:'info',
        showDenyButton: true
    }).then((result) => {
        if (result.isConfirmed) {
            logoutSlice(dispatch);
        } else if (result.isDenied) {
            navigate('/ProfHome');
        }
    })
  }

  return (
    <>
      <div className="topbar">
        <div className="logo-container">
          <img src={Icon} alt="Logo" className="img" />
        </div>

        <div className="dropdown">
          <button className="dropdown-toggle" onClick={toggleMenu}>
            <img src={classUsersImage || ''} alt="User" className="user-icon" />

            <span className="user-name">{classUsersName}</span>
          </button>

          <div className={`dropdown-menu ${open ? 'show' : ''}`}>
            <button className='dropdown-item' onClick={() => manageProfile()}>Manage Profile</button>
            
            <button className='dropdown-item logout-item' onClick={() => logout()}>Logout</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfHeader;
