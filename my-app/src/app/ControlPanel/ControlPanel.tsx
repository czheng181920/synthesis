import { Bounce, toast } from 'react-toastify';

export default function ControlPanel({
  interactiveMode,
  setInteractiveMode,
  inputMode,
  setInputMode,
  alignLines,
  toggleAlignLines,
  numLeftBoxes,
  numRightBoxes,
}: {
  interactiveMode: string;
  setInteractiveMode: (interactiveMode: string) => void;
  inputMode: boolean;
  setInputMode: (inputMode: boolean) => void;
  alignLines: boolean;
  toggleAlignLines: () => void;
  numLeftBoxes: number;
  numRightBoxes: number;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === 'addRemove' || e.target.value === 'compare')
      setInteractiveMode(e.target.value);
  };

  const handleInputModeChange = () => {
    if (interactiveMode === 'compare' && inputMode === false) {
      toast.error("Can't adjust input mode when in compare mode", {
        autoClose: 5000,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      });
      return;
    }
    setInputMode(!inputMode);
  };
  return (
    <div
      style={{
        color: 'white',
        backgroundColor: '#181818',
        padding: '2rem',
      }}
    >
      <h2 className="text-lg md:text-3xl"> Control Panel</h2>
      <div className="grid gap-2 md:gap-4 grid-cols-2 md:grid-cols-1 auto-rows-auto md:auto-rows-min">
        <div style={{ backgroundColor: '#222222', padding: '1rem' }}>
          <h3
            className="text-base md:text-2xl"
            style={{ marginBottom: '.5rem' }}
          >
            Number of boxes on each side:
          </h3>
          <p className="text-xs md:text-base">Left: {numLeftBoxes}</p>
          <p className="text-xs md:text-base">Right: {numRightBoxes}</p>
        </div>
        <div style={{ backgroundColor: '#222222', padding: '1rem' }}>
          <h3
            className="text-base md:text-2xl"
            style={{ marginBottom: '.5rem' }}
          >
            Select an interactive mode:
          </h3>
          <div className="flex flex-row">
            <label
              className="text-xs md:text-base"
              style={{ marginRight: '1rem' }}
            >
              <input
                type="radio"
                value="addRemove"
                checked={interactiveMode === 'addRemove'}
                onChange={handleChange}
              />
              Add/Remove Box Mode
            </label>
            <label
              className="text-xs md:text-base"
              style={{ marginRight: '1rem' }}
            >
              <input
                type="radio"
                value="compare"
                checked={interactiveMode === 'compare'}
                onChange={handleChange}
              />
              Compare Mode
            </label>
          </div>
        </div>

        <div style={{ backgroundColor: '#222222', padding: '1rem' }}>
          <h3
            className="text-base md:text-2xl"
            style={{ marginBottom: '.5rem' }}
          >
            Input or label mode?
          </h3>
          <label>
            {/* lets do a button instead */}
            <button
              style={{ backgroundColor: '#363636', padding: '0.5rem' }}
              onClick={() => handleInputModeChange()}
              className="text-xs md:text-base"
            >
              {inputMode ? 'Label Mode' : 'Input Mode'}
            </button>
          </label>
        </div>
        <div style={{ backgroundColor: '#222222', padding: '1rem' }}>
          <h3
            className="text-base md:text-2xl"
            style={{ marginBottom: '.5rem' }}
          >
            Turn on the animation? :
          </h3>
          <label>
            {/* lets do a button instead */}
            <button
              className="text-xs md:text-base"
              style={{ backgroundColor: '#363636', padding: '0.5rem' }}
              onClick={() => toggleAlignLines()}
            >
              {alignLines ? 'Turn off' : 'Turn on'}
            </button>
          </label>
        </div>
      </div>
    </div>
  );
}
