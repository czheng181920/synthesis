// parameter input is a change react state function
export default function Label({
  text,
  input,
  inputMode,
}: {
  text: number;
  input: (text: number) => void;
  inputMode: boolean;
}) {
  return (
    <input
      id="input"
      type="number"
      value={text}
      onChange={(e) => input(parseInt(e.target.value, 10) || 0)}
      disabled={inputMode}
      min={0}
      max={10}
    />
  );
}
