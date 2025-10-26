import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import type {RootState} from '../../store/store';
import {setFile, setShowUpdateNameModal, setShowUpdateEmailModal, setShowUpdateAddressModal, uploadImageSlice, getRecordSlice} from '../../store/slice/profManageAccSlice';
import ProfHeader from '../../components/ProfHeader';
import ProfSidebar from '../../components/ProfSidebar';
import '../../assets/css/ProfManageAcc.css';
import UpdateNameModal from '../../components/UpdateNameModal';
import UpdateEmailModal from '../../components/UpdateEmailModal';
import UpdateAddressModal from '../../components/UpdateAddressModal';

function ProfManageAcc () {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const classUsersID = localStorage.getItem('classUsersID');

    const file = useSelector((state: RootState) => state.profManageAcc.file);
    const classUsersImage = useSelector((state: RootState) => state.profManageAcc.classUsersImage);
    const classUsersName = useSelector((state: RootState) => state.profManageAcc.classUsersName);
    const classUsersEmail = useSelector((state: RootState) => state.profManageAcc.classUsersEmail);
    const classUsersAddress = useSelector((state: RootState) => state.profManageAcc.classUsersAddress);
    const classUsersRole = useSelector((state: RootState) => state.profManageAcc.classUsersRole);
    const showUpdateNameModal = useSelector((state: RootState) => state.profManageAcc.showUpdateNameModal);
    const showUpdateEmailModal = useSelector((state: RootState) => state.profManageAcc.showUpdateEmailModal);
    const showUpdateAddressModal = useSelector((state: RootState) => state.profManageAcc.showUpdateAddressModal);

    //   Sidebar Function Start
      const [sidebarActive, setSidebarActive] = useState(false);
    
      const toggleSidebar = () => {
        setSidebarActive(!sidebarActive);
      };
    //   Sidebar Function End

    // Animation states
    const [imgLoaded, setImgLoaded] = useState(false);
    const [contentVisible, setContentVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => setContentVisible(true), 100);
        getRecord();
    }, []);

    const getRecord = async () => {
        getRecordSlice(classUsersID, dispatch);
    }

    const uploadImage = async (e: React.FormEvent) => {
        e.preventDefault();

        uploadImageSlice(classUsersID, file, dispatch);
    }
    return(
        <>
        <UpdateNameModal show={showUpdateNameModal} onClose={() => dispatch(setShowUpdateNameModal(false))} />
        <UpdateEmailModal show={showUpdateEmailModal} onClose={() => dispatch(setShowUpdateEmailModal(false))}/>
        <UpdateAddressModal show={showUpdateAddressModal} onClose={() => dispatch(setShowUpdateAddressModal(false))}/>

        <ProfHeader/>

        {/* Sidebar Start */}
        <button className="burger-btn" onClick={toggleSidebar}>
            <i className="fa-solid fa-list" style={{fontSize:15}}></i>
        </button>
        <ProfSidebar sidebarActive={sidebarActive} toggleSidebar={toggleSidebar} />
        {/* Sidebar End */}
        
        <div id='content'>
            <div className={`container mt-4 fade-in ${contentVisible ? 'show' : ''}`}>
                <div className='div'>
                    <div className='div2 glassy pop-in'>
                        <img src={classUsersImage || ''} alt="" className={`img2 shadow-pop ${imgLoaded ? 'img-loaded' : ''}`} onLoad={() => setImgLoaded(true)}/>
                        <br /><br />

                        <form onSubmit={uploadImage}>
                            <input type="file" onChange={e => dispatch(setFile(e.target.files?.[0] || null))} className='form-control'/>
                            <hr />
                            <button className='btn btn-primary w-100 pulse-hover'>Update Profile</button>
                        </form>
                    </div>

                    <div className='div3 slide-up'>
                        <div className='div3-content'>
                            <div className='div4 card-animate'>
                                <h2>Class</h2>
                                <h1>0</h1>
                            </div>

                            <div className='div5 card-animate'>
                                <h2>Assignments</h2>
                                <h1>0</h1>
                            </div>
                        </div>

                        <div className='div3-info fade-in-delayed'>
                            <p className='label'>Name</p>
                            <p>{classUsersName} <button style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', padding: '4px' }} onClick={() => dispatch(setShowUpdateNameModal(true))}><i className="fa-solid fa-pen-to-square" style={{ color: '#facc15', fontSize: '16px' }}></i></button></p>

                            <p className='label'>Email</p>
                            <p>{classUsersEmail} <button style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', padding: '4px' }} onClick={() => dispatch(setShowUpdateEmailModal(true))}><i className="fa-solid fa-pen-to-square" style={{ color: '#facc15', fontSize: '16px' }}></i></button></p>

                            <p className='label'>Address</p>
                            <p>{classUsersAddress} <button style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', padding: '4px' }} onClick={() => dispatch(setShowUpdateAddressModal(true))}><i className="fa-solid fa-pen-to-square" style={{ color: '#facc15', fontSize: '16px' }}></i></button></p>

                            <p className='label'>Role</p>
                            <p>{classUsersRole}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default ProfManageAcc;