import "./chatWindow.css";
import Chat from "./chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useEffect, useState } from "react";
import { RingLoader } from "react-spinners";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";


function ChatWindow({ setShowSidebar }) {
    const { prompt, setPrompt, reply, setReply, currThreadId, username, setUserName, setCurrThreadId, setNewChat, prevChats, setPrevChats } = useContext(MyContext);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [flagShip, setFlagShip] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const { isLoggedIn, setIsLoggedIn } = useContext(MyContext);
    const [isSignup, setIsSignup] = useState(false);
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [showSignUpForm, setShowSignUpForm] = useState(false);
    const [userMessage, setUserMessage] = useState("");

    const getReply = async () => {
        const message = prompt;

        setUserMessage(message);   // save user message
        setIsLoading(true);
        setNewChat(false);
        setPrompt("");


        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            })
        });
        console.log(response);

        const data = await response.json();

        setReply(data.reply);
        setIsLoading(false);
    }

    //append new chat to prev chats
    useEffect(() => {
        if (userMessage && reply) {

            setPrevChats(prev => [
                ...prev,
                { role: "user", content: userMessage },
                { role: "assistant", content: reply }
            ])

        }
    }, [reply])
    const changeDropDown = () => {
        setIsOpen(!isOpen);
    }

    const changeflagShip = () => {
        setFlagShip(!flagShip);
    }

    const logOut = async () => {
        const token = localStorage.getItem("token");
        const logout = await fetch("/api/logout", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!token) {
            toast.error(" user not found");
            return;
        }
        else {
            const data = await logout.json();

            localStorage.removeItem("token");
            console.log(data);
            setIsLoggedIn(false);
            toast.success("user logged out");

        }

    }

    const openLoginForm = async () => {
        setShowLoginForm(!showLoginForm);
    }

    const signup = async (e) => {
        e.preventDefault();

        const response = await fetch("/api/thread/signUp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                email,
                password
            })
        });
        if (response.status === 500) {
            toast.error("Internal server error");
            console.log("responce is ", response);
            return;
        }

        console.log("responce is ", response);
        const data = await response.json();
        console.log("data is ", data);
        toast.success("successfully registered");

        setIsLoggedIn(true);
        setShowLoginForm(false);
        setEmail("");
        setPassword("");
        setUserName("");

    };

    const login = async (e) => {
        e.preventDefault();

        const loginUser = await fetch("/api/thread/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password
            })
        });
        if (loginUser.status == 400) {
            console.log(`user not found  `);
            toast.error("User not found");
            return;
        } else {
            const response = await loginUser.json();
            console.log("login user is ", response);

            localStorage.setItem("token", response.token);

            toast.success('user Logged in ');

            console.log("responce is", response.token);

            setIsLoggedIn(true);
            setShowLoginForm(false);
            setEmail("");
            setPassword("");
        }
    }


    return (
        <>
            <Toaster position="top-center" />
            <div onClick={() => {
                if (flagShip) changeflagShip();
                if (isOpen) changeDropDown();
            }}
                className="chatWindow" >
                <div className="navbar">
                    <div
                        className="close-sidebar"
                        onClick={() => setShowSidebar(prev => !prev)}
                    >
                        <i className="fa-solid fa-bars"></i>
                    </div>
                    <div id="update" onClick={changeflagShip}>
                        <h3 style={{ paddingLeft: "1rem" }}>ChatBox </h3> &nbsp; &nbsp;
                        <h4 className="Auto">Auto  <i className="fa-solid fa-chevron-down"></i></h4>
                    </div>
                    <div className="userIconDiv" onClick={changeDropDown} >
                        <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                    </div>


                </div>

                {
                    flagShip ? (
                        <div className="hoverEffect">
                            <div className="flagship">ChatGpt Plus<span className="upgrade">upgrade</span></div>
                            <div className="flagship">GPT-5.3 <i className="fa-solid fa-check"></i></div>
                        </div>
                    ) : undefined
                }
                {
                    isOpen && (
                        <div className="dropDown">
                            <div className="dropDownItem"><i className="fa-solid fa-gear"></i> Settings</div>
                            <div className="dropDownItem"><i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan</div>
                            {isLoggedIn ? (
                                <div className="dropDownItem" onClick={logOut}>
                                    <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
                                </div>
                            ) : (
                                <div className="dropDownItem" onClick={openLoginForm}>
                                    <i className="fa-solid fa-arrow-right-to-bracket"></i> Login
                                </div>
                            )}

                        </div>
                    )
                }
                {
                    showLoginForm && (
                        <div className="authContainer">
                            <div className="authCard">
                                {!isSignup ? <form onSubmit={login}>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="authInput"
                                        required
                                    /> <br></br><br></br>

                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="authInput"
                                        required
                                    />
                                    <br></br> <br></br>
                                    <button type="submit" className="authBtn">
                                        Login
                                    </button>
                                </form> : <form onSubmit={signup}>
                                    <br></br>
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) => setUserName(e.target.value)}
                                        className="authInput"
                                        required
                                    />
                                    <br></br><br></br>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="authInput"
                                        required
                                    />
                                    <br></br><br></br>
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="authInput"
                                        required
                                    />
                                    <br></br><br></br>
                                    <button type="submit" className="authBtn">
                                        Sign Up
                                    </button>
                                </form>}
                                <p className="switchAuth">
                                    {isSignup ? "Already have an account?" : "Don't have an account?"}
                                    <span onClick={() => setIsSignup(!isSignup)}>
                                        {isSignup ? "Login" : "Signup"}
                                    </span>
                                </p>
                            </div>
                        </div>

                    )
                }


                {!showLoginForm && <Chat></Chat>}

                {/* <Chat></Chat> */}

                <RingLoader color="#fff" loading={isLoading}></RingLoader>


                <div className="chatInput">
                    <div className="inputBox">
                        <input placeholder="Ask anything..."
                            disabled={showLoginForm}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && getReply()}
                        >

                        </input>
                        <div id="submit" onClick={getReply} ><i className="fa-solid fa-paper-plane"></i></div>
                    </div>
                    <p className="info">
                        ChatBox can make mistakes. Check important info. See <span className="link">Cookie Preferences</span>.
                    </p>
                </div>
            </div >
        </>
    )
}

export default ChatWindow;