import { useState, useRef, useLayoutEffect, useEffect, useCallback } from "react"
import { FaAngleUp, FaAngleDown } from "react-icons/fa6"
import { FaRegTrashAlt } from "react-icons/fa"
import "../styles/framework.scss"

function BloqueInputs() {
  const createId = () => crypto.randomUUID()

  const [inputs, setInputs] = useState<string[]>([createId()])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const shouldFocusLastRef = useRef(false)
  const focusIndexRef = useRef<number | null>(null)
  
  const moveItem = <T,>(array: T[], from: number, to: number): T[] => {
    if (to < 0 || to >= array.length) return array
    const newArray = [...array]
    const [item] = newArray.splice(from, 1)
    newArray.splice(to, 0, item)
    return newArray
  }

  const moveUp = useCallback((index: number) => {
    focusIndexRef.current = index - 1;
    setInputs(prev => moveItem(prev, index, index - 1));
  }, []);

  const moveDown = useCallback((index: number) => {
    focusIndexRef.current = index + 1;
    setInputs(prev => moveItem(prev, index, index + 1));
  }, []);

  const removeInput = (index: number) => {
    setInputs(prev => prev.filter((_, i) => i !== index))
    inputRefs.current.splice(index, 1)
  }
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const index = focusIndexRef.current;

      if (index == null ) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if(index < inputs.length - 1) {
            moveDown(index);
            console.log("no funciona abajo")
          }
          break;

        case "ArrowUp":
          if (index > 0){
            moveUp(index);
            console.log("no funciona arriba")
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [inputs.length, moveUp, moveDown]);







  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Tab" && index === inputs.length - 1) {
      e.preventDefault()
      shouldFocusLastRef.current = true
      setInputs(prev => [...prev, createId()])
    }
  }


  useLayoutEffect(() => {

    //En caso de crear elemento con TAB
    if (!shouldFocusLastRef.current) return
    const lastIndex = inputs.length - 1
    const node = inputRefs.current[lastIndex]
    if (node) node.focus()

    shouldFocusLastRef.current = false

    //En caso de mover el foco
    if (focusIndexRef.current !== null) {
    inputRefs.current[focusIndexRef.current]?.focus()
    focusIndexRef.current = null
  }
  }, [inputs])

  return (
    <div className="input-block-master">
      {inputs.map((id, index) => (
        <div className="input-block" key={id}>
          <input
            ref={el => {inputRefs.current[index] = el}}
            onKeyDown={e => handleKeyDown(e, index)}
            style={{ display: "block", marginBottom: "8px" }}
          />

          <div className="div-botones">
            <button
              tabIndex={-1}
              onClick={() => moveUp(index)}
              disabled={index === 0}
            >
              <FaAngleUp />
            </button>

            <button
              tabIndex={-1}
              onClick={() => moveDown(index)}
              disabled={index === inputs.length - 1}
            >
              <FaAngleDown />
            </button>

            <button 
              tabIndex={-1}
              onClick={() => removeInput(index)}
              >
              <FaRegTrashAlt />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default BloqueInputs
