// parameter input is a change react state function
export default function Label({
  text,
  input,
  inputMode,
  interactiveMode,
}: {
  text: number;
  input: (text: number) => void;
  inputMode: boolean;
  interactiveMode: string;
}) {
  const increment = () => {
    if (text === 10) return;
    input(text + 1);
  };
  const decrement = () => {
    if (text === 0) return;
    input(text - 1);
  };
  return (
    <div className="w-full flex flex-row items-center justify-center">
      {inputMode && interactiveMode === 'addRemove' && (
        <button
          type="button"
          onClick={decrement}
          style={{
            fontSize: '4rem',
            textShadow: `
          0 0 .5rem #5ed2e5,
          0 0 1rem #5ed2e5,
          0 0 2rem  #5ed2e5
        `,
            overflow: 'visible',
          }}
        >
          -
        </button>
      )}

      <div
        style={{
          fontSize: '4rem',
          fontWeight: 'bold',
          textAlign: 'center',
          textShadow: `
          0 0 .5rem #5ed2e5,
          0 0 1rem #5ed2e5,
          0 0 2rem  #5ed2e5
        `,
          overflow: 'visible',
          width: '6rem',
        }}
      >
        {text}
      </div>
      {inputMode && interactiveMode === 'addRemove' && (
        <button
          type="button"
          onClick={increment}
          style={{
            fontSize: '4rem',
            textShadow: `
          0 0 .5rem #5ed2e5,
          0 0 1rem #5ed2e5,
          0 0 2rem  #5ed2e5
        `,
            overflow: 'visible',
          }}
        >
          +
        </button>
      )}
    </div>
  );
}
