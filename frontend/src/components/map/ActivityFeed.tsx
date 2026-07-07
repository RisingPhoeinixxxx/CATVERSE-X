"use client";

import { useEffect, useState } from "react";

import "./ActivityFeed.css";

const API = "http://127.0.0.1:8000";

export default function ActivityFeed() {

  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {

    fetch(`${API}/map/activity`)
      .then(res => res.json())
      .then(setReports)
      .catch(console.error);

  }, []);

  return (

    <section className="activity-feed">

      <h2>

        Recent Rescue Activity

      </h2>

      {

        reports.map((report)=>(

          <div key={report.id}>

            <b>{report.cat_name || "Unknown Cat"}</b>

            <br/>

            {report.status}

            {" • "}

            {report.priority}

            <br/>

            {report.description}

          </div>

        ))

      }

    </section>

  );

}