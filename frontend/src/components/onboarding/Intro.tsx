"use client";

import { useState } from "react";
import "./Intro.css";

import Scene1 from "./Scene1";
import Scene2 from "./Scene2";
import Scene3 from "./Scene3";
import GuardianChoice from "./GuardianChoice";
import Synchronize from "./Synchronize";
import LoadingScreen from "./LoadingScreen";

export default function Intro() {

  const [currentScene, setCurrentScene] = useState(1);

  const nextScene = () => {
    setCurrentScene((previous) => previous + 1);
  };

  return (
    <div className="intro">

      {(() => {

        switch (currentScene) {

          case 1:
            return <Scene1 onComplete={nextScene} />;

          case 2:
            return <Scene2 onComplete={nextScene} />;

          case 3:
            return <Scene3 onComplete={nextScene} />;

          case 4:
            return <GuardianChoice />;

          case 5:
            return <Synchronize />;

          case 6:
            return <LoadingScreen />;

          default:
            return <Scene1 onComplete={nextScene} />;

        }

      })()}

    </div>
  );

}