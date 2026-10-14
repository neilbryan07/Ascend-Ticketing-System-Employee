
import './App.css';
import ParticlesDisplay from './component/Particles/ParticlesDisplay';

import { useNavigate, useRoutes } from 'react-router-dom';
import routes from './routes/routes';

function App() {

  const routing = useRoutes(routes);

  return (
    <div className="App">
      {/* <ParticlesDisplay/> */}
      {/* <h1 className='text-5xl text-green-500 font-extrabold'>Hello</h1> */}
      {routing}
    </div>
  );
}

export default App;
