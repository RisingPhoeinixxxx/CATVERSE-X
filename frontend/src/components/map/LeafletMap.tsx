"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function LeafletMap({
  cats,
}: {
  cats: any[];
}) {

  return (

    <MapContainer
      center={[12.9716, 77.5946]}
      zoom={12}
      style={{
        width: "100%",
        height: "100%",
      }}
    >

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {cats.map((cat: any) => (

        <Marker
          key={cat.id}
          position={[cat.latitude, cat.longitude]}
        >

          <Popup>

            <b>{cat.name}</b>

            <br />

            Status: {cat.status}

            <br />

            Health: {cat.health_score}

            <br />

            AI Score: {cat.ai_score}

          </Popup>

        </Marker>

      ))}

    </MapContainer>

  );

}