import { useState, useRef, useLayoutEffect } from "react"
import { FaAngleUp, FaAngleDown } from "react-icons/fa6";
import { FaRegTrashAlt } from "react-icons/fa";
import '../styles/framework.scss'

function BloqueInputs() {
  const [inputs, setInputs] = useState<number[]>([0])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Tab" && index === inputs.length - 1) {
      e.preventDefault()
      setInputs(prev => [...prev, prev.length])
    }
  }

  useLayoutEffect(() => {
    const lastIndex = inputs.length - 1
    const node = inputRefs.current[lastIndex]

    if (node) {
      node.focus()
    }
  }, [inputs])

  return (
    <>
    <div className="input-block-master">
      {inputs.map((id, index) => (
        <>
        <div className="input-block">
          <input
            key={id}
            ref={el => {
              inputRefs.current[index] = el
            }}
            onKeyDown={e => handleKeyDown(e, index)}
            style={{ display: "block", marginBottom: "8px" }}
          />
          <div className="div-botones">
            <button><FaAngleUp /></button>
            <button>< FaAngleDown/></button>
            <button> < FaRegTrashAlt/> </button>
          </div>

        </div>
        </>
      ))}
        
    </div>
    </>
  )
}

export default BloqueInputs