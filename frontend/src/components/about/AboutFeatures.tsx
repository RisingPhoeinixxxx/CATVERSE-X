"use client";

import "./AboutFeatures.css";

const features = [

"AI Digital Twins",

"Real-Time Rescue",

"Smart Shelter Network",

"Predictive Analytics",

"Health Monitoring",

"Community Adoption"

];

export default function AboutFeatures(){

return(

<section className="about-features">

<h2>

Platform Features

</h2>

<div className="feature-grid">

{features.map((feature)=>(

<div
key={feature}
className="feature-card"
>

{feature}

</div>

))}

</div>

</section>

);

}