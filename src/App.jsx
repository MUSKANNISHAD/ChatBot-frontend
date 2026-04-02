import "./App.css";
import ChatWindow from "./chatWindow.jsx";
import Sidebar from "./sidebar.jsx";
import { MyProvider } from "./Mycontext.jsx";


function App() {

  return (
    <div className="app">
      <MyProvider  >
        <Sidebar />
        <ChatWindow />
      </MyProvider >
    </div>
  );
}

export default App;