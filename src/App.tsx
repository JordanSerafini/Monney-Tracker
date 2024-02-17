import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import Home from "./components/pages/Home";

import "./App.css";

const App: React.FC = () => {
  return (
    <Router>
      <div className='flex flex-row gap-5'>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
