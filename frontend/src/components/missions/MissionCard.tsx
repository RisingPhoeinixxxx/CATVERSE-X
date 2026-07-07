"use client";

import "./MissionCard.css";

type Props = {

id:string;

type:string;

location:string;

priority:string;

eta:string;

volunteer:string;

status:string;

};

export default function MissionCard({

id,

type,

location,

priority,

eta,

volunteer,

status

}:Props){

return(

<div className="mission-card">

<div className="mission-top">

<h2>{id}</h2>

<span>{status}</span>

</div>

<h3>{type}</h3>

<p>📍 {location}</p>

<div className="mission-info">

<div>

<strong>Priority</strong>

<p>{priority}</p>

</div>

<div>

<strong>ETA</strong>

<p>{eta}</p>

</div>

</div>

<p className="volunteer">

👤 {volunteer}

</p>

<button>

Open Mission →

</button>

</div>

);

}