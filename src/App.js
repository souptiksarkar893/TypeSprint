import Navbar  from './components/Navbar';
import TypingArea from './components/TypingArea';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="container mt-5">
        <TypingArea />
      </div>
    </div>
  );
}

export default App;
