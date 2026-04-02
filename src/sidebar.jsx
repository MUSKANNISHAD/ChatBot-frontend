import "./sidebar.css";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {
  const { allThreads, setAllThreads, currThreadId, setNewChat, isLoggedIn, username, setUserName, setIsLoggedIn, setPrompt, setReply, setCurrThreadId, prevChats, setPrevChats } = useContext(MyContext);

  const getAllThreads = async () => {
    try {
      const response = await fetch("http://localhost:5000/threads");
      const data = await response.json();
      const filteredData = data.map(thread => ({ threadId: thread.threadId, title: thread.title }));
      setAllThreads(filteredData);

    } catch (err) {
      console.log("error while fetching data", err);
    }
  }

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);

  let startNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);

  }

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);
    try {
      const response = await fetch(`http://localhost:5000/thread/${newThreadId}`);
      const data = await response.json();
      console.log("data is ", data);
      console.log("and messages are ", data.messages);
      setPrevChats(data.messages);
      setNewChat(false);
      setReply(null);
      // setPrevChats(data);

    } catch (err) {
      console.log(err);
    }
  }

  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(`http://localhost:5000/thread/${threadId}`, {
        method: "DELETE"
      });
      const delThread = await response.json();
      console.log(delThread);

      setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));
      if (threadId === currThreadId) {
        startNewChat();
      }

    } catch (err) {
      console.log(err);
    }
  }



  return (
    <section className="sidebar">
      <button className="btn" onClick={startNewChat}>
        <i className="fa-brands fa-openai "></i>
        {/* <img src="/src/assets/blacklogo.png" alt="ChatGPT Logo" className="Smile" /> */}
        <span><i className="fa-solid fa-pen-to-square"></i></span>
      </button>

      {
        isLoggedIn && (
          <ul className="history">
            {
              allThreads?.map((thread, idx) => (
                <li key={idx}
                  onClick={(e) => changeThread(thread.threadId)}
                  className={thread.threadId === currThreadId ? "highlighted" : ""}
                >
                  {thread.title}
                  <i className="fa-solid fa-trash"
                    onClick={(e) => {
                      e.stopPropagation(); //stop event bubbling
                      deleteThread(thread.threadId);
                    }}
                  ></i>
                </li>
              ))
            }

          </ul>
        )


      }


      <div className="sign">
        <p >By <b>Muskan_Nishad</b> &hearts;</p>
      </div>
    </section>
  );
}

export default Sidebar;