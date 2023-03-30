const { spawn } = require('child_process');

/** 
* Genera los fragmentos y el manifiesto para VOD
* @param {string[]} inputFilePaths - Rutas a los ficheros .wav de audio
* @param {string} outputFolder - Ruta a la carpeta donde almacenar los ficheros de salida generados
* @returns {Promise} - Una promise que se resuelve cuando todos los archivos han sido trascodificados y almacenados en la carpeta de salida
*/

function OnDemand(inputFilePaths, outputFolder) {

    let command = `ffmpeg `;
    let adaptation_sets = `-adaptation_sets "`;
    // Añade los ficheros de entrada

    for (inputFilePath of inputFilePaths) {

        command += `-i ${inputFilePath} `;

    }

    // Mapea cada stream de audio de entrada para trascodificar
    for (let n = 0; n < (inputFilePaths.length); n++) {

        command += `-map ${n}:a -c:a libopus -mapping_family 255 -vn `;

        // command += `${outputFolder}/${outputFilenames[n]} `

        adaptation_sets += `id=${n},streams=${n} `;
    }

    command += '-f dash -dash_segment_type webm -seg_duration 10 ';
    // Añade los adaptation sets
    command += adaptation_sets + '" ';

    // Output
    command += `${outputFolder}/manifest.mpd`;

    console.log(`EJECUTANDO COMANDO: \n ${command} \n\n\n`);

    return new Promise((resolve, reject) => {

        const child = spawn(command, {
            stdio: 'ignore',
            shell: true,
        });

        child.on('close', (code) => {

            console.log(`child process exited with code ${code}`);

            if (code === 0) {

                resolve();

            } else {

                reject(new Error(`child process exited with code ${code}`));

            }

        });

    });
    
}

/** 
* Genera los fragmentos y el manifiesto para transmitirlos en directo
* @param {string[]} inputFilePaths - Rutas a los ficheros .wav de audio
* @param {string} outputFolder - Ruta a la carpeta donde almacenar los ficheros de salida generados
*/
function LiveStreaming(inputFilePaths, outputFolder) {

    let command = `ffmpeg -re `;
    let adaptation_sets = `-adaptation_sets "`;
    // Añade los ficheros de entrada

    for (inputFilePath of inputFilePaths) {

        command += `-i ${inputFilePath} `;

    }

    // Mapea cada stream de audio de entrada para trascodificar
    for (let n = 0; n < (inputFilePaths.length); n++) {

        command += `-map ${n}:a -c:a libopus -mapping_family 255 -vn `;

        // command += `${outputFolder}/${outputFilenames[n]} `

        adaptation_sets += `id=${n},streams=${n} `;
    }

    command += '-f dash -dash_segment_type webm -seg_duration 10 -update_period 8 ';
    // Añade los adaptation sets
    command += adaptation_sets + '" ';

    // Output
    command += `${outputFolder}/manifest.mpd`;

    console.log(`EJECUTANDO COMANDO: \n ${command} \n\n\n`)

    const child = spawn(command, {
        stdio: 'ignore',
        shell: true,
        detached: true      // el proceso se ejecuta independientemente del padre
    });

}

module.exports = { OnDemand, LiveStreaming }