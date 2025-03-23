import React, { useState } from "react";
import { FaFileWord } from "react-icons/fa6";
import axios from "axios";

function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [convertMessage, setConvertMessage] = useState("");
  const [downloadError, setDownloadError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setConvertMessage("");
    setDownloadError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setConvertMessage("Please select a file");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:3000/convertFile",
        formData,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        selectedFile.name.replace(/\.[^/.]+$/, "") + ".pdf"
      );

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSelectedFile(null);
      setConvertMessage("✅ File Converted Successfully");
      setDownloadError("");
    } catch (error) {
      setDownloadError(
        error.response && error.response.status === 400
          ? `❌ Error: ${error.response.data.message}`
          : "❌ Conversion failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md text-center border border-gray-300">
        <h2 className="text-3xl font-bold text-gray-700">Convert Word to PDF</h2>
        <p className="text-gray-500 mt-2">Upload a Word file to convert</p>

        {/* File Input word-pdf-conv.onrender.com  */}
        <div className="mt-4">
          <input
            type="file"
            accept=".doc,.docx"
            onChange={handleFileChange}
            className="hidden"
            id="fileUpload"
          />
          <label
            htmlFor="fileUpload"
            className="flex items-center justify-center px-4 py-3 border border-gray-400 rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200 transition"
          >
            <FaFileWord className="text-blue-500 text-2xl mr-2" />
            <span className="text-gray-700 text-lg">
              {selectedFile ? selectedFile.name : "Choose File"}
            </span>
          </label>
        </div>

        {/* Convert Button https://word-pdf-conv.onrender.com/convertFile*/}
        <button
          onClick={handleSubmit}
          disabled={!selectedFile || loading}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400"
        >
          {loading ? "Converting..." : "Convert File"}
        </button>

        {/* Messages */}
        {convertMessage && (
          <p className="text-green-500 mt-2">{convertMessage}</p>
        )}
        {downloadError && <p className="text-red-500 mt-2">{downloadError}</p>}
      </div>
    </div>
  );
}

export default Home;