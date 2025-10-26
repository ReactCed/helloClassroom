import {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import type {RootState} from '../../store/store';
import ProfHeader from '../../components/ProfHeader';
import ProfSidebar from '../../components/ProfSidebar';

function ProfStream () {
    //   Sidebar Function Start
    const [sidebarActive, setSidebarActive] = useState(false);

    const toggleSidebar = () => {
        setSidebarActive(!sidebarActive);
    };
    //   Sidebar Function End

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {code} = useParams();

    return(
        <>
        <ProfHeader/>

        {/* Sidebar Start */}
        <button className="burger-btn" onClick={toggleSidebar}>
            <i className="fa-solid fa-list" style={{fontSize:15}}></i>
        </button>
        <ProfSidebar sidebarActive={sidebarActive} toggleSidebar={toggleSidebar} />
        {/* Sidebar End */}

        <div id="content">
            <div className="container mt-4">
                {/* Main Content Start */}
                <h1>{code}</h1>
                {/* Main Content End */}
            </div>
        </div>
        </>
    );
}

export default ProfStream;