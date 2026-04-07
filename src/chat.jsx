import "./chat.css";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";


function Chat() {
    const { newChat, prevChats, reply } = useContext(MyContext);
    const [latestReply, setLatestReply] = useState(null);

    useEffect(() => {
        if (reply === null) {
            setLatestReply(null);
            return;
        }

        if (!prevChats?.length) return;

        const content = reply.split(" ");  // split in individual words

        let idx = 0;
        const interval = setInterval(() => {
            setLatestReply(content.slice(0, idx + 1).join(" "));

            idx++;
            if (idx > content.length) clearInterval(interval);
        }, 40);

        console.log("prevChats:", prevChats);
        console.log("type:", typeof prevChats);
        return () => clearInterval(interval);

    }, [prevChats, reply])


    return (
        <>
            {newChat && <h1>Hii  Muskan Nishad , whatsupp</h1>}
            <div className="chats">
                {
                    prevChats?.map((chat, idx) =>
                        <div className={chat.role === "user" ? "userDiv" : "gptDiv"} key={idx}>
                            {chat.role === "user" ?
                                <p className="userMessage">{chat.content}</p> :
                                <div className="gptMessage">
                                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                        {chat.content}
                                    </ReactMarkdown>
                                </div>
                                // <p className="gptMessage">{chat.content}</p>
                            }
                        </div>
                    )
                }
                {
                    prevChats?.length > 0 && (
                        <>
                            {latestReply === null ? (
                                <div className="gptDiv" key="non-typing">
                                    <div className="gptMessage">
                                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                            {prevChats[prevChats.length - 1].content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            ) : (
                                <div className="gptDiv" key="typing">
                                    <div className="gptMessage">
                                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                            {latestReply}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            )}
                        </>
                    )
                }
            </div>
        </>
    )
}

export default Chat;