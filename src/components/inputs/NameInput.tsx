import { JSX } from "solid-js";

/**
 * NameInput: Controlled input for names (only letters & spaces allowed)
 * Props:
 *   value: string
 *   onInput: (value: string) => void
 *   ...rest: standard <input> props
 */
export default function NameInput(props: {
  value: string;
  onInput: (value: string) => void;
} & JSX.InputHTMLAttributes<HTMLInputElement>) {
  // Only allow letters (a-z, A-Z), spaces, and optional accents
  function handleInput(e: InputEvent & { currentTarget: HTMLInputElement }) {
    let raw = e.currentTarget.value;
    // Remove all non-letter and non-space chars
    let filtered = raw.replace(/[^\p{L} ]+/gu, "");
    props.onInput(filtered);
  }
  return (
    <input
      {...props}
      value={props.value}
      onInput={handleInput}
      autocomplete="off"
      inputMode="text"
      pattern="[A-Za-z ]*"
    />
  );
}
