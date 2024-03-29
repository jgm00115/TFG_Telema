/**
 * Componente de selector de track
 * @param {} numTracks - El número de tracks en total
 * @param {} track - El track seleccionado
 * @param {} setTrack - Setter para actualizar el valor del track seleccionado
 * @param {string[]} trackNames - Nombre de los tracks (violin,cello,etc.)
 * @returns {JSX.Element} - Un selector de track con el que el usuario puede interactuar
 */
export default function TrackSelector({ numTracks, track, setTrack, trackNames}) {

    function handleChange(event) {
        setTrack(event.target.value)
    }

    // Crea la lista de opciones
    const options = Array(numTracks)

    for (let i = 0; i < options.length; i++){
        options[i] = <option key={i} value={i}>
                        {trackNames[i]}
                    </option>
    }

    return (
        <select value={track} onChange={handleChange}>
            {options}
        </select>
    )
}