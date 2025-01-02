import Homepage from './Pages/Homepage';
import Chatpage from './Pages/Chatpage';
import "./App.css"
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      
      <Routes>
        <Route path='/' element={<Homepage/>} exact />
        <Route path='/chats' element={<Chatpage/>} />
      </Routes>
      
    </div>
  );
}

export default App;
