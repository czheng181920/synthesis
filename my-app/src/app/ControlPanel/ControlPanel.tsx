export default function ControlPanel({
  interactiveMode,
  setInteractiveMode,
  inputMode,
  setInputMode,
}: {
  interactiveMode: string;
  setInteractiveMode: (interactiveMode: string) => void;
  inputMode: boolean;
  setInputMode: (inputMode: boolean) => void;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === 'addRemove' || e.target.value === 'compare')
      setInteractiveMode(e.target.value);
  };
  return (
    <div style={{ color: 'white' }}>
      <h3>Select an interactive mode:</h3>
      <label style={{ marginRight: '1rem' }}>
        <input
          type="radio"
          value="addRemove"
          checked={interactiveMode === 'addRemove'}
          onChange={handleChange}
        />
        Add/Remove Box Mode
      </label>

      <label style={{ marginRight: '1rem' }}>
        <input
          type="radio"
          value="compare"
          checked={interactiveMode === 'compare'}
          onChange={handleChange}
        />
        Compare Mode
      </label>
    </div>
  );
}
