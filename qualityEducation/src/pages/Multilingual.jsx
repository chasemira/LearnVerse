import React from "react";
import PDFConverter from "../components/PDFConverter"; // Adjust the path if necessary
import "./Multilingual.css";

export default function Multilingual() {
  return (
    <div className="multilingual-container">
      <h1 className="multilingual-title">Multilingual PDF Converter</h1>
      <PDFConverter />
    </div>
  );
}
