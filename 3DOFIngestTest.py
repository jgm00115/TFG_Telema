#! /Users/jaimegarcia/miniconda3/envs/head/bin/python
import requests, json, datetime, subprocess
import numpy as np

def setStreamData():
    # Instrument groups in each main channel
    position = [
        {'name': 'POS1', 'channel': 0},
        
    ]
    X = [0]
    Y = [0]
    for pos,x,y in zip(position,X,Y):
        pos['x'] = x
        pos['y'] = y
    data = {
        'title': f'testing-{datetime.date.today()}-3DOF',
        'description': 'functionality test',
        'positions': position
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
    # Endpoint to create a new presentation
    new_stream_endpoint = f'http://{server_addr}/stream/'
    # Send request to the server
    response = requests.post(new_stream_endpoint,json=streamData)
    # Get the id
    id = json.loads(response.content)['id']
    # Build the URL of the ingest endpoint
    ingest_endpoint = f'http://{server_addr}/ingest/{id}/'
    # FFmpeg
    command = ffmpegCommand(audiofiles,group_names,ingest_endpoint)
    # Execute the command
    print(' '.join(command))
    subprocess.run(' '.join(command), shell=True)

if __name__ == '__main__':
    
    streamData = setStreamData()
    
    # audio files to process with ffmpeg
    audiofiles = [
            "audio/3DOF/pos1.wav",
    ]

    group_names = [
            'pos1',
    ]

    server_addr = 'localhost:8080'

    main(server_addr,streamData, audiofiles, group_names)
