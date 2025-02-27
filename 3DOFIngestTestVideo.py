#! /Users/christopherditchburn/miniconda3/envs/head/bin/python
import requests, json, datetime, subprocess
import numpy as np

def setStreamData():
    # Instrument groups in each main channel
    position = [
        {'name': 'POS1', 'channel': 0},
    ]
    X = [0]
    Y = [0]
    for pos, x, y in zip(position, X, Y):
        pos['x'] = x
        pos['y'] = y
    data = {
        'title': f'testing-{datetime.date.today()}-3DOF',
        'description': 'functionality test',
        'positions': position
    }
    return data

def ffmpegCommand(videoFiles, audiofiles, group_names, ingest_endpoint):
    command = ['ffmpeg', '-re']

    # Add video files first
    for videoFile in videoFiles:
        command.extend(['-i', videoFile])
    
    # Then add audio files
    for audiofile in audiofiles:
        command.extend(['-i', audiofile])
    
    # Number of video inputs (used to offset audio mapping)
    num_video = len(videoFiles)
    
    mapping_options = []
    # Map the video stream from the first video file (input 0)
    mapping_options.extend([
         '-map', '0:v',
         # Use 'copy' if the video is already encoded as desired,
         # or replace with re-encoding options (e.g., libx264, preset, crf) if needed.
         '-c:v', 'libvpx-vp9',
         '-b:v', '2M',
    ])
    
    # Map each audio track. Audio inputs follow after video inputs.
    for index, group_name in enumerate(group_names):
         # Audio input index is offset by the number of video files.
         input_index = num_video + index
         mapping_options.extend([
             '-map', f'{input_index}:a',
             '-c:a', 'libopus',
             '-ac', '9',  # Adjust if you need a different channel count (e.g., -ac 2 for stereo)
             '-mapping_family', '255',
             f'-metadata:s:a:{index}', f'language={group_name}'
         ])
    
    command.extend(mapping_options)
    
    # DASH packaging options
    command.extend([
         '-f', 'dash',
         '-dash_segment_type', 'webm',
         '-seg_duration', '4',
         '-update_period', '8',
         '-streaming', '1',
         '-target_latency', '12',
    ])
    
    # Build the adaptation sets string:
    # Assume video will be adaptation set 0 and audio sets follow.
    adaptation_sets = '"'
    adaptation_sets += 'id=0,streams=0 '  # video stream is stream 0
    for n in range(len(audiofiles)):
         # Audio streams start at stream index 1, 2, etc.
         adaptation_sets += f'id={n+1},streams={n+1} '
    adaptation_sets += '"'
    
    command.extend([
         '-adaptation_sets', adaptation_sets,
         f'{ingest_endpoint}manifest.mpd'
    ])

    return command

def main(server_addr, streamData, videoFiles, audiofiles, group_names):
    # Endpoint to create a new presentation
    new_stream_endpoint = f'http://{server_addr}/stream/'
    # Send request to the server
    response = requests.post(new_stream_endpoint, json=streamData)
    # Get the id from the server response
    id = json.loads(response.content)['id']
    # Build the URL of the ingest endpoint
    ingest_endpoint = f'http://{server_addr}/ingest/{id}/'
    # Build the FFmpeg command
    command = ffmpegCommand(videoFiles, audiofiles, group_names, ingest_endpoint)
    # Print and execute the command
    print(' '.join(command))
    subprocess.run(' '.join(command), shell=True)

if __name__ == '__main__':
    streamData = setStreamData()
    
    # Video and audio files to process with ffmpeg
    videoFiles = [
        "/Users/christopherditchburn/Downloads/CAM01-CONDUCTOR_8k_dash_libx265.mp4"
    ]
    audiofiles = [
        "audio/3DOF/pos1.wav",
    ]
    group_names = [
        'pos1',
    ]
    server_addr = 'localhost:8080'
    
    # Now pass both videoFiles and audiofiles to main
    main(server_addr, streamData, videoFiles, audiofiles, group_names)
