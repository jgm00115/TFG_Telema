import { React } from 'react';
import  ThreeControls  from '../components/controls/ThreeControls';


const SixDOF = () => {
    return (
        <div>
            <ThreeControls
                width={200}
                depth={300}
                height={150}
            />
        </div>
    );
}

export default SixDOF;