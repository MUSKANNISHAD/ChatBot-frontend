import { createContext, useState } from "react";
import { v1 as uuidv1 } from "uuid";

export const MyContext = createContext();

export const MyProvider = ({ children }) => {

    const [prompt, setPrompt] = useState("");
    const [reply, setReply] = useState(null);
    const [currThreadId, setCurrThreadId] = useState(uuidv1());
    const [newChat, setNewChat] = useState(true);
    const [prevChats, setPrevChats] = useState([]);
    const [allThreads, setAllThreads] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUserName] = useState("");

    return (
        <MyContext.Provider
            value={{
                prompt, setPrompt,
                reply, setReply,
                currThreadId, setCurrThreadId,
                newChat, setNewChat,
                prevChats, setPrevChats,
                allThreads, setAllThreads,
                isLoggedIn, setIsLoggedIn,
                username, setUserName,
              
            }}
        >
            {children}
        </MyContext.Provider>
    );
};