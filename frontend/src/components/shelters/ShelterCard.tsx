"use client";

import "./ShelterCard.css";

export default function ShelterCard({
  shelter,
}: {
  shelter: any;
}) {

  const availableBeds =
    shelter.capacity - shelter.current_animals;

  return (

    <div className="shelter-card">

      <h2>{shelter.name}</h2>

      <p>
        📍 {shelter.address}
      </p>

      <p>
        🛏 Capacity: {shelter.capacity}
      </p>

      <p>
        🐈 Current Animals: {shelter.current_animals}
      </p>

      <p>
        ✅ Available Beds: {availableBeds}
      </p>

      <p>
        📞 {shelter.phone}
      </p>

      <p>
        ✉️ {shelter.email}
      </p>

    </div>

  );

}