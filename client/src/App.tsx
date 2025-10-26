import {BrowserRouter, Routes, Route} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Loader from './components/Loader';
import StudHome from './pages/student/StudHome';
import ProfHome from './pages/professor/ProfHome';
import ProfManageAcc from './pages/professor/ProfManageAcc';
import StudManageAcc from './pages/student/StudManageAcc';
import StudStream from './pages/student/StudStream';
import ProfStream from './pages/professor/ProfStream';

function App() {

  return (
    <>
    <Loader/>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/Auth' element={<Auth/>}/>
        <Route path='/StudHome' element={<StudHome/>}/>
        <Route path='/ProfHome' element={<ProfHome/>}/>
        <Route path='/ProfManageAcc' element={<ProfManageAcc/>}/>
        <Route path='/StudManageAcc' element={<StudManageAcc/>}/>
        <Route path='/StudStream/:code' element={<StudStream/>}/>
        <Route path='/ProfStream/:code' element={<ProfStream/>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
