// Componente de fader de volumen
export default function Fader({ gain, setGain, min, max, step }) {

    // Cambia el valor de ganancia cuando el valor del input cambia
    function handleChange(event) {
        setGain(event)  // funcion que devuelve setGain (recibe el objeto event)
    }

    return (
        <input
            type='range'
            min={min}
            max={max}
            step={step}
            value={gain}
            onChange={handleChange}
        />
    );
}