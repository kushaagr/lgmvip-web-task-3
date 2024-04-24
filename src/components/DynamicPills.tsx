import React, { useState, useRef } from "react";
import { ChangeEvent, KeyboardEvent, SetStateAction, Dispatch } from "react";
import "./DynamicPills.css";

// Pill component
const Pill = (props: {
  text: string;
  removePill: () => void;
  className: string;
}) => {
  return (
    <div className={`${props.className}`} onClick={props.removePill}>
      {props.text}
      {/* <span className="remove-icon">x</span> */}
    </div>
  );
};

interface PillInterface {
  text: string;
}

interface PillInputProps {
  className?: string;
  inputId: string;
  value?: PillInterface[],
//   onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  // setParentState?: Dispatch<SetStateAction<PillInterface[]>>;
  // setValue?: Dispatch<SetStateAction<PillInterface[]>>;
  // setParentState?: (value: PillInterface[]) => void;
  setValue: (value: PillInterface[]) => void;
  placeholder?: string;
}

// PillInput component
// const PillInput: React.FC<PillInputProps> = (
//   props: {
//     className?: string,
//     inputId: string,
//     onChange?: (ChangeEvent<HTMLInputElement>) => void,
//     placeholder?: string
//   }
// )
const PillInput: React.FC<PillInputProps> = ({
  className,
  inputId,
  value = [],
  setValue,
  // setParentState,
  placeholder = "Type..."
}) => {
  const [pillText, setPillText] = useState<string>("");
  // const [pills, setPills] = useState<PillInterface[]>(value);
  const [scrollToEnd, setScrollToEnd] = useState<boolean>(false);
  const pillBox = useRef<HTMLDivElement>(null);

  const handlePillInput = (event: ChangeEvent<HTMLInputElement>) => {
    setPillText(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (scrollToEnd === true) {
      pillBox.current?.scroll({ left: 2000 });
      setScrollToEnd(false);
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (pillText.trim() === '')
        return;
      const newPill = { text: pillText.trim() };
      if (newPill) {
        if (setValue) setValue([...value, newPill]);
        // setPills([...pills, newPill]);
        // // if (setParentState) setParentState([...value, newPill]);
        // if (setParentState) setParentState([...pills, newPill]);
        setPillText("");
        setScrollToEnd(true);
      }
    } else if (
      event.key === "Backspace" &&
      pillText === "" &&
      value.length > 0
      // pills.length > 0
    ) {
      if (setValue) setValue(value.slice(0, -1));
      // setPills(pills.slice(0, -1));
      // // if (setParentState) setParentState(value.slice(0, -1));
      // if (setParentState) setParentState(pills.slice(0, -1));
    }
  };

  const removePill = (index: number) => {
    const updatedPills = [...value];
    // const updatedPills = [...pills];
    updatedPills.splice(index, 1);
    if (setValue) setValue(value);
    // setPills(updatedPills);
  };

  return (
    <div className={`pill-widget ${className}`}>
      <div id="pillContainer" className={"pill-widget__pill-box "} ref={pillBox}>
        {/* {pillls.map((pill, index) => ( */}
        {value.map((pill, index) => (
          <Pill
            key={`pill-${index}`}
            text={pill.text}
            removePill={() => removePill(index)}
            className={"pill-widget__pill"}
          />
        ))}
      </div>
      <input
        type="text"
        id={inputId}
        className="pill-widget__pill-creator"
        placeholder={placeholder}
        value={pillText}
        onChange={handlePillInput}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default PillInput;
export type { PillInterface } ;