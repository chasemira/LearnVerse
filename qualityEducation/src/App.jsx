import { useState } from "react";
import PDFConverter from "./PDFConverter";

function App() {
    const [section, setSection] = useState("home");

    return (
        <div>
            <nav className="navbar">
                <button onClick={() => setSection("home")}>Home</button>
                <button onClick={() => setSection("pdfConverter")}>PDF Converter</button>
            </nav>

            {section === "home" && <h1>Welcome to the App</h1>}
            {section === "pdfConverter" && <PDFConverter />}
        </div>
    );
}

export default App;