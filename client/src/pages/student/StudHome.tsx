import React, {useEffect, useState} from 'react';
import {useSound} from 'react-sounds';
import {useNavigate, useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import type {RootState} from '../../store/store';
import {getRecordSlice, getProfImageSlice, getProfNameSlice, unenrollSlice} from '../../store/slice/studHomeSlice';
import StudHeader from '../../components/StudHeader';
import StudSidebar from '../../components/StudSidebar';
import '../../assets/css/StudHome.css';
import JoinClassModal from '../../components/JoinClassModal';
import Swal from 'sweetalert2';

function StudHome () {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const record = useSelector((state: RootState) => state.studHome.record);

    const [profImage, setProfImage] = useState<{ [key: string]: string }>({});
    const [profName, setProfName] = useState<{ [key: string]: string }>({});
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredRecords, setFilteredRecords] = useState(record);

    useEffect(() => {
        getRecord();
    },[])

    useEffect(() => {
        if (record.length > 0) {
          record.forEach(async (rec) => {
            const image = await getProfImageSlice(rec.class_classstud_profid);
            setProfImage((prev) => ({ ...prev, [rec.class_classstud_profid]: image }));

            const name = await getProfNameSlice(rec.class_classstud_profid);
            setProfName((prev) => ({ ...prev, [rec.class_classstud_profid]: name }));
          });
        }
    }, [record]);

    // Real-time search filter
    useEffect(() => {
        const filtered = record.filter((rec) => {
            const titleMatch = rec.class_classstud_title.toLowerCase().includes(searchTerm.toLowerCase());
            const sectionMatch = rec.class_classstud_section.toLowerCase().includes(searchTerm.toLowerCase());
            const codeMatch = rec.class_classstud_code.toString().includes(searchTerm);
            const profNameMatch = profName[rec.class_classstud_profid]?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
            
            return titleMatch || sectionMatch || codeMatch || profNameMatch;
        });
        setFilteredRecords(filtered);
    }, [searchTerm, record, profName]);

    const getRecord = async () => {
        getRecordSlice(dispatch);
    }

    // For Modal Start
    const { play } = useSound('notification/popup');
    const [open, setOpen] = useState(false);
    // For Modal End

    //   Sidebar Function Start
      const [sidebarActive, setSidebarActive] = useState(false);
    
      const toggleSidebar = () => {
        setSidebarActive(!sidebarActive);
      };
    //   Sidebar Function End

    const joinClass = async () => {
        play();
        setOpen(true);
    }

    const unenroll = async (code: number) => {
        Swal.fire({
            title:'Are You Sure?',
            text:'Do you really want to unenroll from this class?',
            icon:'info',
            showDenyButton:true
        }).then((result) => {
            if (result.isConfirmed) {
                unenrollSlice(code, dispatch);
            } else if (result.isDenied) {
                window.location.reload();
            }
        })
    }

    const viewClass = async (code: number) => {
        navigate(`/StudStream/${code}`);
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    }

    const clearSearch = () => {
        setSearchTerm('');
    }

    return(
        <>
        <JoinClassModal open={open} onOpenChange={setOpen} />
        <StudHeader/>

        {/* Sidebar Start */}
        <button className="burger-btn" onClick={toggleSidebar}>
            <i className="fa-solid fa-list" style={{fontSize:15}}></i>
        </button>
        <StudSidebar sidebarActive={sidebarActive} toggleSidebar={toggleSidebar} />
        {/* Sidebar End */}
        
        <div id="content">
            <div className="container mt-4">
                {/* Main Content Start */}
                <div>
                    <div className="search-add-container">
                        <div className="search-container">
                            <div className="search-input-wrapper">
                                <i className="fa-solid fa-search search-icon"></i>
                                <input 
                                    type="text" 
                                    className="search-input" 
                                    placeholder="Search classes by title, section, code, or professor..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                                {searchTerm && (
                                    <button className="clear-search-btn" onClick={clearSearch}>
                                        <i className="fa-solid fa-times"></i>
                                    </button>
                                )}
                            </div>
                        </div>
                        <button className='btn btn-outline-primary add-class-btn' onClick={() => joinClass()} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0) scale(1)'}><i className="fa-solid fa-door-open add-icon"></i> Join Class</button>
                    </div>

                    {/* Search Results Info */}
                    {searchTerm && (
                        <div className="search-results-info">
                            <span className="results-count">
                                {filteredRecords.length} class{filteredRecords.length !== 1 ? 'es' : ''} found
                                {searchTerm && <span className="search-term"> for "{searchTerm}"</span>}
                            </span>
                        </div>
                    )}

                    <div className="cards-container">
                    
                        {/* Premium Card Start */}

                        {filteredRecords.length > 0 ? (
                            filteredRecords.map((rec) => (
                            <div className="premium-card premium-animate" key={rec.class_classstud_id}>
                                <div className="card-glow"></div>

                                <div className="card-header">
                                    <div className="profile-container">
                                        <img src={profImage[rec.class_classstud_profid]} alt="Profile" className="profile-pic" onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}/>
                                        
                                        <div className="profile-status"></div>
                                    </div>

                                <div className="card-title-group">
                                    <div style={{display:'flex', justifyContent:'flex-end'}}>
                                        <div className="dropdown">
                                            <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button>

                                            <ul className="dropdown-menu">
                                                <li><button className="dropdown-item" onClick={() => unenroll(rec.class_classstud_code)}>Unenroll</button></li>
                                            </ul>
                                        </div>
                                    </div>

                                    <h5 className="card-title">
                                        <span className="title-icon">📚</span>

                                        <span className="card-title-text">{rec.class_classstud_title}</span>
                                    </h5>
                                    
                                    <p className="card-section">
                                        <i className="fa-solid fa-users section-icon"></i>

                                        <span className="card-text">Section: {rec.class_classstud_section}</span>
                                    </p>
                                    
                                    <p className="card-prof">
                                        <i className="fa-solid fa-user-tie prof-icon"></i>

                                        <span className="card-text">Prof: {profName[rec.class_classstud_profid]}</span>
                                    </p>

                                    <p className="card-prof">
                                        <i className="fa-solid fa-key prof-icon"></i>

                                        <span className="card-text">Class Code: {rec.class_classstud_code}</span>
                                    </p>
                                </div>
                                </div>
                                
                                <div className="card-stats">
                                    <div className="stat-item">
                                        <span className="stat-number">24</span>

                                        <span className="stat-label">Students</span>
                                    </div>

                                    <div className="stat-divider"></div>

                                    <div className="stat-item">
                                        <span className="stat-number">8</span>
                                        
                                        <span className="stat-label">Assignments</span>
                                    </div>
                                </div>
                                
                                <div className="card-footer">
                                    <button className="btn view-btn"
                                        onMouseEnter={e => {
                                        e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                                        e.currentTarget.style.boxShadow = '0 12px 32px rgba(99,102,241,0.3)';
                                        }}

                                        onMouseLeave={e => {
                                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.14)';
                                        }}
                                        
                                        onClick={() => viewClass(rec.class_classstud_code)}><i className="fa-solid fa-arrow-right view-icon"></i>View Class</button>
                                </div>
                            </div>
                            ))
                        ) : searchTerm ? (
                            <div className="no-results">
                                <div className="no-results-icon">
                                    <i className="fa-solid fa-search"></i>
                                </div>
                                <h3 className="no-results-title">No classes found</h3>
                                <p className="no-results-text">
                                    No classes match your search for "<span className="search-term">{searchTerm}</span>". 
                                    Try adjusting your search terms.
                                </p>
                                <button className="btn btn-outline-primary" onClick={clearSearch}>
                                    <i className="fa-solid fa-times"></i> Clear Search
                                </button>
                            </div>
                        ) : (
                            record.map((rec) => (
                            <div className="premium-card premium-animate" key={rec.class_classstud_id}>
                                <div className="card-glow"></div>

                                <div className="card-header">
                                    <div className="profile-container">
                                        <img src={profImage[rec.class_classstud_profid]} alt="Profile" className="profile-pic" onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}/>
                                        
                                        <div className="profile-status"></div>
                                    </div>

                                <div className="card-title-group">
                                    <div style={{display:'flex', justifyContent:'flex-end'}}>
                                        <div className="dropdown">
                                            <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button>

                                            <ul className="dropdown-menu">
                                                <li><button className="dropdown-item" onClick={() => unenroll(rec.class_classstud_code)}>Unenroll</button></li>
                                            </ul>
                                        </div>
                                    </div>

                                    <h5 className="card-title">
                                        <span className="title-icon">📚</span>

                                        <span className="card-title-text">{rec.class_classstud_title}</span>
                                    </h5>
                                    
                                    <p className="card-section">
                                        <i className="fa-solid fa-users section-icon"></i>

                                        <span className="card-text">Section: {rec.class_classstud_section}</span>
                                    </p>
                                    
                                    <p className="card-prof">
                                        <i className="fa-solid fa-user-tie prof-icon"></i>

                                        <span className="card-text">Prof: {profName[rec.class_classstud_profid]}</span>
                                    </p>

                                    <p className="card-prof">
                                        <i className="fa-solid fa-key prof-icon"></i>

                                        <span className="card-text">Class Code: {rec.class_classstud_code}</span>
                                    </p>
                                </div>
                                </div>
                                
                                <div className="card-stats">
                                    <div className="stat-item">
                                        <span className="stat-number">24</span>

                                        <span className="stat-label">Students</span>
                                    </div>

                                    <div className="stat-divider"></div>

                                    <div className="stat-item">
                                        <span className="stat-number">8</span>
                                        
                                        <span className="stat-label">Assignments</span>
                                    </div>
                                </div>
                                
                                <div className="card-footer">
                                    <button className="btn view-btn"
                                        onMouseEnter={e => {
                                        e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                                        e.currentTarget.style.boxShadow = '0 12px 32px rgba(99,102,241,0.3)';
                                        }}

                                        onMouseLeave={e => {
                                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.14)';
                                        }}
                                        
                                        onClick={() => viewClass(rec.class_classstud_code)}><i className="fa-solid fa-arrow-right view-icon"></i>View Class</button>
                                </div>
                            </div>
                            ))
                        )}

                        {/* Premium Card End */}
                        
                    </div>
                    
                </div>
                {/* Main Content End */}
            </div>
        </div>
        </>
    );
}

export default StudHome;