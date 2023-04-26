export default function RotationSelector({rotation,setRotation, min, max, step}){
    
    function handleChange(event){
        setRotation(event.target.value);
    }
    
    const options = [];
    for (let pos = min; pos <= max; pos+=step){
        options.push(
                <option key={pos} value={pos}>
                    {pos}
                </option>
            );
    }

    return(
        <select value ={rotation} onChange={handleChange}>
            {options}
        </select>
    );
}