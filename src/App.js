import { Route, Routes } from 'react-router-dom';
import './App.css';
import Chats from './Pages/Chats';
import Home from './Pages/Home';

function App() {
  return (
    <div className='App'>
     <Routes>
      <Route path='/' element={<Home></Home>}></Route>
      <Route path='/chat' element={<Chats></Chats>}></Route>
     </Routes>
    </div>
  );
}

export default App;
