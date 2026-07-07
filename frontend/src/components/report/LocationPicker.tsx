"use client";

import { useEffect, useState } from "react";

import "./ReportCat.css";

export default function LocationPicker() {

  const [latitude, setLatitude] = useState<number | null>(null);

  const [longitude, setLongitude] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {

    if (!navigator.geolocation) {

      setError("Geolocation is not supported.");

      setLoading(false);

      return;

    }

    navigator.geolocation.getCurrentPosition(

      (position) => {

        setLatitude(position.coords.latitude);

        setLongitude(position.coords.longitude);

        setLoading(false);

      },

      () => {

        setError("Location permission denied.");

        setLoading(false);

      }

    );

  }, []);

  return (

    <div className="report-card">

      <div className="card-header">

        <h2>

          📍 Rescue Location

        </h2>

        <p>

          Current GPS Location

        </p>

      </div>

      <div className="location-box">

        {

          loading &&

          <p>

            Detecting location...

          </p>

        }

        {

          error &&

          <p className="location-error">

            {error}

          </p>

        }

        {

          !loading && !error && (

            <>

              <div className="coordinate">

                <strong>Latitude</strong>

                <span>

                  {latitude}

                </span>

              </div>

              <div className="coordinate">

                <strong>Longitude</strong>

                <span>

                  {longitude}

                </span>

              </div>

              <button
                className="refresh-location"
                onClick={() => window.location.reload()}
              >

                Refresh Location

              </button>

            </>

          )

        }

      </div>

    </div>

  );

}