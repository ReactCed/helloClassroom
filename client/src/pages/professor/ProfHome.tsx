import { useState, useEffect } from 'react';
import {useSound} from 'react-sounds';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import {setRecord, getRecordSlice, getProfNameSlice, getProfImageSlice, setEditID, setEditCode, setEditTitle, setEditSection, delClassSlice} from '../../store/slice/profHomeSlice';
import ProfHeader from '../../components/ProfHeader';
import ProfSidebar from '../../components/ProfSidebar';
import '../../assets/css/ProfHome.css';
import AddClassModal from '../../components/AddClassModal';
import EditClassModal from '../../components/EditClassModal';
import Swal from 'sweetalert2';

function ProfHome() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const record = useSelector((state: RootState) => state.profHome.record);

  const [profNames, setProfNames] = useState<{ [key: string]: string }>({});
  const [profImage, setProfImage] = useState<{ [key: string]: string }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRecords, setFilteredRecords] = useState(record);

  useEffect(() => {
    getRecord();
  },[]);

  useEffect(() => {
    if (record.length > 0) {
      record.forEach(async (rec) => {
        const name = await getProfNameSlice(rec.class_classprof_profid);
        setProfNames((prev) => ({ ...prev, [rec.class_classprof_profid]: name }));

        const image = await getProfImageSlice(rec.class_classprof_profid);
        setProfImage((prev) => ({ ...prev, [rec.class_classprof_profid]: image }));
      });
    }
  }, [record]);

  // Real-time search filter
  useEffect(() => {
    const filtered = record.filter((rec) => {
      const titleMatch = rec.class_classprof_title.toLowerCase().includes(searchTerm.toLowerCase());
      const sectionMatch = rec.class_classprof_section.toLowerCase().includes(searchTerm.toLowerCase());
      const codeMatch = rec.class_classprof_code.toString().includes(searchTerm);
      const profNameMatch = profNames[rec.class_classprof_profid]?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      
      return titleMatch || sectionMatch || codeMatch || profNameMatch;
    });
    setFilteredRecords(filtered);
  }, [searchTerm, record, profNames]);

  // For Modal Start
  const { play } = useSound('notification/popup');
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  // For Modal End

  //   Sidebar Function Start
  const [sidebarActive, setSidebarActive] = useState(false);

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };
  //   Sidebar Function End

  const getRecord = async () => {
    getRecordSlice(dispatch);
  }

  const addClass = async () => {
    play();
    setOpen(true);
  }

  const edit = async (id: number, code: number, title: string, section: string) => {
    play();
    setOpen2(true);
    dispatch(setEditID(id));
    dispatch(setEditCode(code));
    dispatch(setEditTitle(title));
    dispatch(setEditSection(section));
  }

  const del = async (id: number, code: number) => {
    Swal.fire({
      title:'Are You Sure?',
      text:'Do you want to delete this class?',
      icon:'info',
      showDenyButton:true
    }).then((result) => {
      if (result.isConfirmed) {
        delClassSlice(id, code, dispatch);
      } else if (result.isDenied) {
        window.location.reload();
      }
    })
  }

  const viewClass = async (code: number) => {
    navigate(`/ProfStream/${code}`);
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }

  const clearSearch = () => {
    setSearchTerm('');
  }

  return (
    <>
      <AddClassModal open={open} onOpenChange={setOpen} />
      <EditClassModal open={open2} onOpenChange={setOpen2} />
      <ProfHeader />

      {/* Sidebar Start */}
      <button className="burger-btn" onClick={toggleSidebar}>
        <i className="fa-solid fa-list" style={{fontSize:15}}></i>
      </button>
      <ProfSidebar sidebarActive={sidebarActive} toggleSidebar={toggleSidebar} />
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
              <button className='btn btn-outline-primary add-class-btn' onClick={() => addClass()} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0) scale(1)'}><i className="fa-solid fa-plus add-icon"></i> Add Class</button>
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
                <div className="premium-card premium-animate" key={rec.class_classprof_id}>
                  <div className="card-glow"></div>

                  <div className="card-header">
                    <div className="profile-container">
                      <img src={profImage[rec.class_classprof_profid]} alt="Profile" className="profile-pic" onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}/>
                      
                      <div className="profile-status"></div>
                    </div>

                    <div className="card-title-group">
                      <div style={{display:'flex', justifyContent:'flex-end'}}>
                        <div className="dropdown">
                          <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button>

                          <ul className="dropdown-menu">
                            <li><button className="dropdown-item" onClick={() => edit(rec.class_classprof_id, rec.class_classprof_code, rec.class_classprof_title, rec.class_classprof_section)}>Edit</button></li>

                            <li><button className="dropdown-item" onClick={() => del(rec.class_classprof_id, rec.class_classprof_code)}>Delete</button></li>
                          </ul>
                        </div>
                      </div>

                      <h5 className="card-title">
                        <span className="title-icon">📚</span>
                        <span className="card-title-text">{rec.class_classprof_title}</span>
                      </h5>
                      
                      <p className="card-section">
                        <i className="fa-solid fa-users section-icon"></i>
                        <span className="card-text">Section: {rec.class_classprof_section}</span>
                      </p>
                      
                      <p className="card-prof">
                        <i className="fa-solid fa-user-tie prof-icon"></i>
                        <span className="card-text">Prof: {profNames[rec.class_classprof_profid]}</span>
                      </p>

                      <p className="card-prof">
                        <i className="fa-solid fa-key prof-icon"></i>
                        <span className="card-text">Class Code: {rec.class_classprof_code}</span>
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
                      
                      onClick={() => viewClass(rec.class_classprof_code)}><i className="fa-solid fa-arrow-right view-icon"></i>View Class</button>
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
                <div className="premium-card premium-animate" key={rec.class_classprof_id}>
                  <div className="card-glow"></div>

                  <div className="card-header">
                    <div className="profile-container">
                      <img src={profImage[rec.class_classprof_profid]} alt="Profile" className="profile-pic" onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}/>
                      
                      <div className="profile-status"></div>
                    </div>

                    <div className="card-title-group">
                      <div style={{display:'flex', justifyContent:'flex-end'}}>
                        <div className="dropdown">
                          <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button>

                          <ul className="dropdown-menu">
                            <li><button className="dropdown-item" onClick={() => edit(rec.class_classprof_id, rec.class_classprof_code, rec.class_classprof_title, rec.class_classprof_section)}>Edit</button></li>

                            <li><button className="dropdown-item" onClick={() => del(rec.class_classprof_id, rec.class_classprof_code)}>Delete</button></li>
                          </ul>
                        </div>
                      </div>

                      <h5 className="card-title">
                        <span className="title-icon">📚</span>
                        <span className="card-title-text">{rec.class_classprof_title}</span>
                      </h5>
                      
                      <p className="card-section">
                        <i className="fa-solid fa-users section-icon"></i>
                        <span className="card-text">Section: {rec.class_classprof_section}</span>
                      </p>
                      
                      <p className="card-prof">
                        <i className="fa-solid fa-user-tie prof-icon"></i>
                        <span className="card-text">Prof: {profNames[rec.class_classprof_profid]}</span>
                      </p>

                      <p className="card-prof">
                        <i className="fa-solid fa-key prof-icon"></i>
                        <span className="card-text">Class Code: {rec.class_classprof_code}</span>
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
                      
                      onClick={() => viewClass(rec.class_classprof_code)}><i className="fa-solid fa-arrow-right view-icon"></i>View Class</button>
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

export default ProfHome;