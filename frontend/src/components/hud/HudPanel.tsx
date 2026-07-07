"use client";

import "./HudPanel.css";

type Props = {
  title: string;
  value: string;
  footer: string;
};

export default function HudPanel({ title, value, footer }: Props) {
  return (
    <div className="hud-panel">

      <div className="hud-top">

        <span className="hud-title">
          {title}
        </span>

      </div>

      <div className="hud-value">

        {value}

      </div>

      <div className="hud-footer">

        {footer}

      </div>

    </div>
  );
}