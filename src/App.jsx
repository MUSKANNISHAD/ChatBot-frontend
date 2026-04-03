import "./App.css";
import ChatWindow from "./chatWindow.jsx";
import Sidebar from "./sidebar.jsx";
import { MyProvider } from "./MyContext.jsx";
import { useState } from "react";


function App() {

  const [showSidebar, setShowSidebar] = useState(false);


  return (
    <div className="app">
      <MyProvider  >
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <ChatWindow setShowSidebar={setShowSidebar} />
      </MyProvider >
    </div>
  );
}

export default App;