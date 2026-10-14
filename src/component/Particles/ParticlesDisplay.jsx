import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";

import { particles_link } from "../../contants"; 

const ParticlesDisplay = () => {
  const [init, setInit] = useState(false);
  useEffect(() => {
    initParticlesEngine(async (engine) => {
        await loadFull(engine);

    }).then(() => {
      setInit(true);
    });
  }, []);


  const options = useMemo(
    () => (particles_link),
    [],
  );

  if (init) {
    return <Particles id="tsparticles" options={options} />;
  }

  return <></>;
};

export default ParticlesDisplay