import { LiveProvider, LiveEditor } from 'react-live';
import dracula from 'prism-react-renderer/themes/dracula';
import { useSteps } from '../context/StepsProvider';

const DebugDetails: React.FC = () => {
  const { code } = useSteps();
  return (
    <LiveProvider key={code} code={code} theme={dracula} language="json" disabled>
      <LiveEditor />
    </LiveProvider>
  );
};

export default DebugDetails;
