"use client";

import { useRef, useState } from "react";
import "./ReportCat.css";

export default function ImageUploader() {

  const inputRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<File[]>([]);

  function handleFiles(
    e: React.ChangeEvent<HTMLInputElement>
  ) {

    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    setImages(files);

  }

  return (

    <div className="report-card">

      <div className="card-header">

        <h2>📸 Cat Images</h2>

        <p>
          Upload up to 5 clear photos.
        </p>

      </div>

      <div
        className="upload-area"
        onClick={() => inputRef.current?.click()}
      >

        <input

          ref={inputRef}

          hidden

          multiple

          accept="image/*"

          type="file"

          onChange={handleFiles}

        />

        <div className="upload-icon">

          🐱

        </div>

        <h3>

          Click to Upload

        </h3>

        <p>

          JPG • PNG • WEBP • HEIC

        </p>

      </div>

      {

        images.length > 0 && (

          <div className="preview-grid">

            {

              images.map((file, index) => (

                <div
                  key={index}
                  className="preview-card"
                >

                  <img
                    src={URL.createObjectURL(file)}
                    alt=""
                  />

                  <span>

                    {file.name}

                  </span>

                </div>

              ))

            }

          </div>

        )

      }

    </div>

  );

}