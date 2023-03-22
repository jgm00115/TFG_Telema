import Fader from './Fader'

export default function Mixer({ gains, setGains, numFaders }) {

    const faders = [];

    /**
     * Actualiza el array de ganancias cuando el valor de algún 
     * fader cambia
     * 
     * @param {number} index - el índice de la ganancia que cambia de valor
     * @returns {function} Recibe como parámetro el evento (onChange) que
     * triggerea el usuario
     */
    const setGain = (index) => (event) => {
        const nextGains = gains.map((gain, i) => {

            if (i === index) {
                return event.target.value;
            } else {
                return gain;
            }
        });

        setGains(nextGains)
    }

    for (let i = 0; i < numFaders; i++) {

        faders.push(
            <Fader
                key={i}
                gain={gains[i]}
                setGain={setGain(i)}
                min={0}
                max={1}
                step={0.1}
            />
        )
    }

    return (
        <div>
            {faders}
        </div>

    )
}