import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
//import Header from "./components/Header/Header";
import Home from "./components/pages/Home";

import "./App.css";

const App: React.FC = () => {
  return (
    <Router>
<div className='w-10/10 h-screen bg-gray-100 flex flex-col items-center justify-center'>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
