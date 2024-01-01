//import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import SecondPage from './pages/SecondPage';
import Home from './pages/Home';
import {Toaster} from 'react-hot-toast'

function App() {
  return (
    <>
    <div>
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            theme: {
              primary: ''
            }
          }
        }}
      ></Toaster>
    </div>


    <BrowserRouter>
      <Routes>
        <Route path ='/' element={<Home/>}> </Route>
        <Route path ='/editor/:roomId' element={<SecondPage/>}> </Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
