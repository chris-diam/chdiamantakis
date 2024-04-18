import { useState } from "react";
import Terminal, {
  ColorMode,
  TerminalInput,
  TerminalOutput,
} from "react-terminal-ui";

import git from "./assets/github-logo.png";
import linkedin from "./assets/linkedin-logo.png";
import email from "./assets/email .png";

const App = (props = {}) => {
  const [terminalLineData, setTerminalLineData] = useState([
    <TerminalOutput key={0}>
      {/* <div className="bg-red-[200]">
        <h2 className="text-3xl font-bold ">Christos Diamantakis</h2>
        <h3>React Developer</h3>
        <h4>Type "help" to see list of available commands.</h4>
      </div> */}
    </TerminalOutput>,
  ]);
  const [lineData, setLineData] = useState([
    <TerminalOutput key={0}>
      <div className="bg-red-[200]">
        <h2 className="text-3xl font-bold ">Christos Diamantakis</h2>
        <h3>React Developer</h3>
        <h4>Type "help" to see list of available commands.</h4>
      </div>
    </TerminalOutput>,
  ]);

  const handleInput = (terminalInput: string) => {
    // Split input into command and arguments
    const [command, ...args] = terminalInput.trim().split(" ");

    // Handle different commands
    switch (command) {
      case "help":
        setTerminalLineData((prevData) => [
          ...prevData,
          <TerminalOutput key={prevData.length}>
            <div>
              <p>List of available commands:</p>
              <ul>
                <li>help</li>
                <li>whoami</li>
                <li>experience</li>
                <li>skills</li>
                <li>education</li>
                <li>clear</li>
              </ul>
            </div>
          </TerminalOutput>,
        ]);
        break;
      case "whoami":
        setTerminalLineData((prevData) => [
          ...prevData,
          <TerminalOutput key={prevData.length}>
            <div>
              <p>Name: Christos Diamantakis</p>
              <p>Role: React Developer</p>
              <p>Bio: Lorem ipsum dolor sit amet...</p>
            </div>
          </TerminalOutput>,
        ]);
        break;
      default:
        setTerminalLineData((prevData) => [
          ...prevData,
          <TerminalOutput key={prevData.length}>
            <p>Command not found: {terminalInput}</p>
          </TerminalOutput>,
        ]);
        break;
    }
  };

  function onInput(input: string) {
    let ld = [...lineData];
    ld.push(<TerminalInput>{input}</TerminalInput>);
    if (input.toLocaleLowerCase().trim() === "help") {
      ld.push(
        <TerminalOutput>
          <div>
            <p>List of available commands:</p>
            <ul>
              <li>help</li>
              <li>whoami</li>
              <li>experience</li>
              <li>skills</li>
              <li>education</li>
              <li>clear</li>
            </ul>
          </div>
        </TerminalOutput>
      );
    } else if (input.toLocaleLowerCase().trim() === "whoami") {
      ld.push(
        <div className="break-normal my-2">
          <p className="break-normal">
            Front End Developer with a strong focus on the React library.
            Passionate about implementing robust and responsive designs, I
            specialize in creating clean, secure, and privacy-conscious code.
          </p>
          <div className="flex flex-row gap-2 my-2">
            <img src={email} width={25} height={8} />
            <p>ch.diamantakis@gmail.com</p>
          </div>
          <div className="flex flex-row gap-2 my-2">
            <img src={git} width={25} height={8} />
            <a href="https://github.com/chris-diam">chris-diam</a>
          </div>
          <div className="flex flex-row gap-2 my-2">
            <img src={linkedin} width={25} height={8} />
            <a href="https://www.linkedin.com/in/christos-diamantakis/">
              Christos Diamantakis
            </a>
          </div>
        </div>
      );
    } else if (input.toLocaleLowerCase().trim() === "clear") {
      ld = [];
    } else if (input) {
      ld.push(<TerminalOutput>Unrecognized command</TerminalOutput>);
    }
    setLineData(ld);
  }

  return (
    <div className=" md:w-full">
      <Terminal
        colorMode={ColorMode.Dark}
        onInput={onInput}
        prompt="$"
        height="100vh"
      >
        {lineData}
      </Terminal>
    </div>
  );
};

export default App;
