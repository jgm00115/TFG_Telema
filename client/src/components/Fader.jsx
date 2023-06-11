// Componente de fader de volumen
export default function Fader({ gain, setGain, min, max, step, faderlabel,showlabel }) {

    // Cambia el valor de ganancia cuando el valor del input cambia
    function handleChange(event) {
        setGain(event)  // funcion que devuelve setGain (recibe el objeto event)
    }

    return (
        <div>
            <p className={showlabel ? 'faderlabel': 'hidden_faderlabel'}>
                {faderlabel}
            </p>
             <input
            type='range'
            min={min}
            max={max}
            step={step}
            value={gain}
            onChange={handleChange}
            />
        </div>
        
    );
}