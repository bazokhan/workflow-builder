import { useState } from 'react';
import StepDetails from './components/StepDetails';
import DnDTree from './components/DnDTree';
import SidebarHeader from './components/SidebarHeader';
import StepsProvider from './context/StepsProvider';
import DebugDetails from './components/DebugDetails';

const App: React.FC = () => {
  const [showDebug, setShowDebug] = useState(false);

  return (
    <StepsProvider>
      <div className="w-screen h-screen overflow-hidden grid grid-cols-aside">
        <div className="overflow-y-hidden h-screen">
          <SidebarHeader showDebug={showDebug} setShowDebug={setShowDebug} />
          <DnDTree />
        </div>
        <div className={`${showDebug ? 'bg-[#282a36]' : 'bg-white'} overflow-y-auto max-w-full`}>
          {showDebug ? <DebugDetails /> : <StepDetails />}
        </div>
      </div>
    </StepsProvider>
  );
};

export default App;
