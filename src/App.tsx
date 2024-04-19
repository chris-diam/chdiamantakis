import { useState, useEffect } from "react";
import Terminal, {
  ColorMode,
  TerminalInput,
  TerminalOutput,
} from "react-terminal-ui";

import { ReactTyped } from "react-typed";

import git from "./assets/github-logo.png";
import linkedin from "./assets/linkedin-logo.png";
import email from "./assets/email .png";

const App = () => {
  const [lineData, setLineData] = useState([
    <TerminalOutput key={0}>
      <div className="bg-red-[200]">
        <h2 className="text-3xl font-bold ">
          <ReactTyped
            strings={["Christos Diamantakis"]}
            typeSpeed={80}
            backSpeed={50}
            loop
          />
        </h2>

        <h3>React Developer</h3>
        <h4>Type "help" to see list of available commands.</h4>
      </div>
    </TerminalOutput>,
  ]);

  function onInput(input: string) {
    let ld = [...lineData];
    ld.push(
      <div>
        <TerminalInput>{input}</TerminalInput>
      </div>
    );
    if (input.toLocaleLowerCase().trim() === "help") {
      ld.push(
        <TerminalOutput>
          <div>
            <p>Available commands:</p>
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
    } else if (input.toLocaleLowerCase().trim() === "education") {
      ld.push(
        <div className="break-normal my-2">
          <p className=" font-bold text-2xl">
            Bachelor's in Applied Informatics
          </p>
          <p className="italic text-[#ffce00]">University of Macedonia</p>
          <p>December 2021</p>
        </div>
      );
    } else if (input.toLocaleLowerCase().trim() === "skills") {
      ld.push(
        <div className="break-normal my-2 flex">
          <ol>
            <li className="my-4">
              Programming & Scripting Languages
              <ul className="font-bold text-white">
                <li>Typescript/Javascript (Node.js), Bash</li>
              </ul>
            </li>
            <li className="my-4">
              Markup & Style Sheet Languages
              <ul className="font-bold text-white">
                <li>HTML, CSS</li>
              </ul>
            </li>
            <li className="my-4">
              Frameworks & Libraries
              <ul className="font-bold text-white">
                <li>
                  React, React Native, Angular, Redux, GraphQL, Tailwind CSS,
                  D3.js
                </li>
              </ul>
            </li>
            <li className="my-4">
              Containerization
              <ul className="font-bold text-white">
                <li>Docker</li>
              </ul>
            </li>
            <li className="my-4">
              Databases
              <ul className="font-bold text-white">
                <li>MongoDB, SQL, PostgreSQL</li>
              </ul>
            </li>
            <li className="my-4">
              Authentication
              <ul className="font-bold text-white">
                <li>Keycloak, Clerk</li>
              </ul>
            </li>
            <li className="my-4">
              Version Control Systems
              <ul className="font-bold text-white">
                <li>Git</li>
              </ul>
            </li>
            <li className="my-4">
              Miscellaneous
              <ul className="font-bold text-white">
                <li>Latex, Postman, Figma, VSCode</li>
              </ul>
            </li>
            <li className="my-4">
              Languages
              <ul className="font-bold text-white">
                <li>
                  Greek (Native proficiency), English (Professional working
                  proficiency), French (Certificate in French Language)
                </li>
              </ul>
            </li>
          </ol>
        </div>
      );
    } else if (input.toLocaleLowerCase().trim() === "experience") {
      ld.push(
        <div className="break-normal my-2">
          <p className="break-normal font-bold">
            Software Engineer - Research and Development Associate
          </p>
          <p className="italic text-[#ffce00]">
            Centre for Research and Technology Hellas (CERTH) / Information
            Technologies Institute (ITI)
          </p>
          <ul className="list-disc text-red-200 my-2">
            <li>
              - Research, design and development of a robust and responsive Web
              applications.
            </li>
            <li>
              - Participation in drafting technical documentation and project
              deliverables.
            </li>
            <li>
              - Introduction of new technologies, tools and technical workflows.
            </li>
          </ul>
          <p className="font-bold text-sm">April 2022 - Present</p>
          <p className="font-bold mt-2">Contribution to research projects:</p>
          <ol>
            <li className="my-2">
              <p className="font-bold text-[#ffce00] italic text-xl">
                <a href="https://fever-h2020.eu/">Fever</a>
              </p>
              <p>
                Developed the Graphical User Interfaces with React.js and React
                Native providing users to register, single-on authorization with
                Keycloak, preform transactions as well as managing the members
                registration and transaction requests making use the
                infastructure of project consortium.
              </p>
            </li>
            <li className="my-2">
              <p className="font-bold text-[#9ebf46] italic text-xl">
                <a href="https://pop-machina.eu/">POP-MACHINA</a>
              </p>
              <p>
                Worked in in the debbuging and beautification of the trading
                platform of the project built with Angular.js.
              </p>
            </li>
            <li className="my-2">
              <p className="font-bold text-[#508784] italic text-xl">
                <a href="https://odin-smarthospitals.eu/">ODIN</a>
              </p>
              <p>
                Created an administration platform for manipulating and
                monitoring the resources of hospitals connected in the IoT and
                visualize patients data with D3.js. library
              </p>
            </li>
          </ol>
        </div>
      );
    } else if (input.toLocaleLowerCase().trim() === "clear") {
      ld = [
        <TerminalOutput key={0}>
          <div className="bg-red-[200]">
            <h2 className="text-3xl font-bold ">Christos Diamantakis</h2>
            <h3>React Developer</h3>
            <h4>Type "help" to see list of available commands.</h4>
          </div>
        </TerminalOutput>,
      ];
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
