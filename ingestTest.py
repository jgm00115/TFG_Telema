#! /Users/jaimegarcia/miniconda3/envs/head/bin/python
import requests, json, datetime, subprocess
import numpy as np

def setStreamData():
    # Grupos de instrumentos en cada canal del main
    instruments = [
        {'name': 'AS', 'channel': 0},
        {'name': 'CB_A', 'channel': 1},
        {'name': 'CL', 'channel': 2},
        {'name': 'FG', 'channel': 3},
        {'name': 'FL', 'channel': 4},
        {'name': 'HR', 'channel': 5},
        {'name': 'OB', 'channel': 6},
        {'name': 'TB', 'channel': 7},
        {'name': 'TI', 'channel': 8},
        {'name': 'TM', 'channel': 9},
        {'name': 'TR', 'channel': 10},
        {'name': 'TU', 'channel': 11},
        {'name': 'VC_A', 'channel': 12},
        {'name': 'VN_I', 'channel': 13},
        {'name': 'VN_II', 'channel': 14}
    ]
    azimuths = [0,80,-20,20,-15,40,15,55,-5,-15,30,65,80,-80,-65]
    elevations = np.zeros(len(azimuths)).astype('int').tolist()
    for instrument,az,el in zip(instruments,azimuths,elevations):
        instrument['azimuth'] = az
        instrument['elevation'] = el
    data = {
        'title': f'testing-{datetime.date.today()}',
        'description': 'prueba de funcionamiento',
        'instruments': instruments
    }
    return data

def ffmpegCommand(audiofiles, group_names, ingest_endpoint):
    command = ['ffmpeg','-re']

    for audiofile in audiofiles:
        input_options = ['-i',audiofile]
        command.extend(input_options)
    
    transcode_options = []
    for index, group_name in enumerate(group_names):
        transcode_options.extend(['-map', f'{index}:a',
                              '-c:a', 'libopus',
                              '-mapping_family', '255',
                              '-vn',
                              f'-metadata:s:a:{index}', f'language={group_name}'
                              ])
    command.extend(transcode_options)
    
    command.extend([
        '-f','dash',
        '-dash_segment_type','webm',
        '-seg_duration','4',
        '-update_period','8',
        '-streaming','1',
        '-target_latency','12',
    ])

    adaptation_sets = '"'

    for n in range(0,len(audiofiles)):        
        adaptation_sets += f'id={n},streams={n} '
    
    adaptation_sets += '"'

    command.extend([
        '-adaptation_sets',adaptation_sets,
        f'{ingest_endpoint}manifest.mpd'
    ])

    return command

def main(server_addr,streamData, audiofiles, group_names):
    # Endpoint para crear una nueva presentación
    new_stream_endpoint = f'http://{server_addr}/stream/'
    # Envia petición al servidor
    response = requests.post(new_stream_endpoint,json=streamData)
    # Obtiene el id
    id = json.loads(response.content)['id']
    # Construye el URL del endpoint para la ingesta
    ingest_endpoint = f'http://{server_addr}/ingest/{id}/'
    # FFmpeg
    command = ffmpegCommand(audiofiles,group_names,ingest_endpoint)
    # Ejecuta el comando
    print(' '.join(command))
    subprocess.run(' '.join(command), shell=True)

if __name__ == '__main__':
    
    streamData = setStreamData()
    
    # ficheros de audio que procesar con ffmpeg
    audiofiles = [
            '/Users/jaimegarcia/Documents/TFG_Telema/audio/Unaligned/VC.wav',
            '/Users/jaimegarcia/Documents/TFG_Telema/audio/Unaligned/FL.wav',
            '/Users/jaimegarcia/Documents/TFG_Telema/audio/Unaligned/VN_I.wav',
            '/Users/jaimegarcia/Documents/TFG_Telema/audio/Unaligned/MAIN.wav'
    ]

    group_names = [
            'cellos',
            'flautas',
            'violines',
            'main'
    ]

    server_addr = 'localhost:8080'

    main(server_addr,streamData, audiofiles, group_names)
