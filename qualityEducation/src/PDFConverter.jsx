import React, { useState } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import * as pdfjs from "pdfjs-dist/build/pdf";
import "pdfjs-dist/build/pdf.worker.entry";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "./PDFConverter.css";

// Set the correct PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.0.279/pdf.worker.min.js`;

function PDFConverter() {
    const [pdfFile, setPdfFile] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type === "application/pdf") {
            const fileURL = URL.createObjectURL(file);
            setPdfFile(fileURL);
        } else {
            alert("Please select a valid PDF file.");
        }
    };

    return (
        <div className="pdf-container">
            <div className="pdf-viewer">
                <h2>Upload and View PDF</h2>
                <input type="file" accept="application/pdf" onChange={handleFileChange} />
                {pdfFile && (
                    <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.0.279/pdf.worker.min.js">
                        <Viewer fileUrl={pdfFile} />
                    </Worker>
                )}
            </div>
        </div>
    );
}

export default PDFConverter;
