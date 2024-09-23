import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState('');
    const [recentPrompt, setRecentPrompt] = useState('');
    const [prevPrompt, setPrevPrompt] = useState([]); // Store previous prompts
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState('');
    const [chatHistory, setChatHistory] = useState([]); // To store multiple chats
    const [darkMode, setDarkMode] = useState(false);

    // Simulate typewriter effect for the response
    const delayPara = (index, nextWord) => {
        setTimeout(() => {
            setResultData((prev) => prev + nextWord);
        }, 75 * index);
    };

    // Start a new chat session
    const newChat = () => {
        setLoading(false);
        setShowResult(false);
        setResultData(''); // Clear previous chat result
    };

    // Handle prompt submission
    const onSent = async (prompt) => {
        setResultData(''); // Clear result display before loading the new response
        setLoading(true);
        setShowResult(true);
        let response;

        // If the prompt is provided, use it. Otherwise, use the input.
        const currentPrompt = prompt || input;
        if (currentPrompt) {
            response = await run(currentPrompt);
            setRecentPrompt(currentPrompt);
            setPrevPrompt((prev) => [...prev, currentPrompt]); // Add to previous prompts
        }

        // Handle response and format it with typewriter effect
        let responseArray = response.split('**');
        let newResponse = responseArray.map((item, i) =>
            i % 2 === 1 ? `<b>${item}</b>` : item
        ).join('');

        let formattedResponse = newResponse.split('*').join('</br>');
        let wordsArray = formattedResponse.split(' ');
        wordsArray.forEach((word, i) => delayPara(i, word + ' '));

        // Store in chat history
        setChatHistory((prev) => [...prev, { prompt: currentPrompt, response }]);
        setLoading(false);
        setInput(''); // Reset input field
    };

    const toggleDarkMode = () => {
        setDarkMode(prev => !prev);
    };

    const contextValue = {
        prevPrompt, // Store previous prompts
        setPrevPrompt,
        onSent, // Handle submission
        setRecentPrompt,
        recentPrompt, // Store most recent prompt
        showResult, // Control result display visibility
        loading, // Track loading state
        resultData, // Chat result
        input, // Input value for prompt
        setInput, // Setter for input
        newChat, // Start a new chat session
        chatHistory, // Store all chat history
        darkMode, // Provide darkMode state in context
        toggleDarkMode // Provide darkMode toggle function in context
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;
