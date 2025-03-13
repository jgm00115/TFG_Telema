#! /Users/jaimegarcia/miniconda3/bin/python

import json
import shlex
import pathlib
import requests
import argparse
import datetime
from subprocess import run

def scan_source_files(source,subdirs_names):
    source_files = {}
    # Check for subdirectories inside the source directory
    subdirs = [d for d in source.glob('*') if d.is_dir and d.name.lower() in subdirs_names]
    # Obtain filepaths for all the source file depending on its type
    for subdir in subdirs:
        subdir_name = subdir.name.lower()
        files = [f for f in subdir.glob('*') if f.stem != '.DS_Store']
        source_files.update({subdir_name:files})
    
    return source_files

def input_files(command,source_files):
    for source_type,files in source_files.items():
        for file in files:
            command.extend(['-i',shlex.quote(str(file))])
    
    return command

def encode_opt(command,source_files,audio_codec,video_codec):
    # iterate over the dictionary with the source file filepaths
    file_idx = 0
    audio_files = 0
    video_files = 0
    for source_type, files in source_files.items():
        # iterate over the source file filepaths for each source type
        for file in files:
            # command encoding options
            match source_type:
                case 'sss' | '3dof':
                    command.extend([
                        '-map', f'{file_idx}:a',
                        '-c:a',audio_codec
                    ])
                    # add mapping family if audio codec is not set to copy
                    if audio_codec.lower() != 'copy':
                        command.extend(['-mapping_family', '255'])
                    
                    command.extend([
                        f'-metadata:s:a:{audio_files}', f'title={source_type}-{file.stem}',
                        f'-metadata:s:a:{audio_files}', f'language={source_type}-{file.stem}'
                    ])
                    audio_files += 1
                case 'video':
                    command.extend([
                        '-map', f'{file_idx}:v',
                        '-c:v', video_codec,
                        f'-metadata:s:v:{video_files}', f'title={source_type}-{file.stem}',
                        f'-metadata:s:v:{video_files}', f'language={source_type}-{file.stem}'
                    ])
                    video_files += 1
                case _:
                    pass
            # increment the file index
            file_idx += 1
    return command

def adaptation_sets(command,source_files):
    
    adaptation_sets = []
    src_idx = 0
    for source_type, files in source_files.items():
        for n in range(len(files)):
            adaptation_sets += [f'id={src_idx},streams={src_idx}']
            src_idx += 1
    # format the adaptation set list and append to the ffmpeg command
    adaptation_sets_string = r'"' + f"{' '.join(adaptation_sets)}" + r' "'
    command.extend([
        '-adaptation_sets',adaptation_sets_string
    ])

    return command

def ffmpeg_command(command, source_files, audio_codec, video_codec, container):
    # input files to the ffmpeg command
    command = input_files(command,source_files)
    # encoding options
    command = encode_opt(command,source_files,audio_codec,video_codec)
    # container format
    command.extend([
        '-f','dash',
        '-dash_segment_type',container
    ])
    # adaptation sets
    # command = adaptation_sets(command,source_files)
    
    return command

def new_streaming_request(streaming_data,server_address,endpoint='stream/'):
    # send a POST request to the server endpoint
    # request body contains the streaming data formatted into JSON
    try:
        url = f'http://{server_address}/{endpoint}'
        response = requests.post(
            url,
            json=streaming_data)
        # if success, the created streaming id should be returned
        # in the response
        if response.status_code != 200:
            print(f'Received status code {response.status_code}')
            return None
        # parse json response and return the streaming id
        response = response.json()
        return  response.get('id')
        
    except requests.exceptions.RequestException as e:
        print(f'Request failed: {e}')
        return None

    except json.JSONDecodeError:
        print(f'Failed to parse JSON response')
        return None

def main(source,conf_file,output,realtime):
    script_dir = pathlib.Path(__file__).resolve()
    # if a configuration file parameter is provided, set the varible accordingly
    # try to load the file located in the same script directory by default
    conf_file = pathlib.Path(conf_file) if conf_file is not None else script_dir/'conf.json'
    # load the configuration from the json file
    with open('./conf.json','r') as f:
        conf = json.load(f)
    server_address = conf.get('server_address')
    streaming_data = conf.get('streaming_data')
    audio_codec = conf.get('audio_codec')
    video_codec = conf.get('video_codec')
    container = conf.get('container')
    subdirs_names = tuple(conf.get('subdirs_names'))
    # initialize the ffmpeg command
    command = ['ffmpeg','-re'] if realtime else ['ffmpeg']
    # scan the root directory containing source files 
    source_files = scan_source_files(
        pathlib.Path(source).resolve(),
        subdirs_names)
    # build the ffmpeg command 
    command = ffmpeg_command(command, source_files,audio_codec,video_codec,container)
    # send the streaming data to the server if an address was provided
    streaming_id = new_streaming_request(streaming_data,server_address) if server_address is not None else None
    # set the output of the ffmpeg command depending on the id value
    if streaming_id is not None:
        # API endpoint of the media server
        output = f'http://{server_address}/ingest/{streaming_id}/'
    else:
        output = pathlib.Path(output).resolve()
        output = f'{str(output)}/manifest.mpd'
    command.extend([
            output
        ])
    # run the built command
    # print(command)
    print(f"{' '.join(command)}\n\n")
    run(' '.join(command),shell=True)

if __name__ == '__main__':
    # Create CLI 
    parser = argparse.ArgumentParser(
        prog = 'MPEG-DASH streaming formatting tool',
        description = 'Crawls through a directory containing audio and video source files, formats them into MPEG-DASH stream within the same manifest file.'
    )
    # Define CLI parameters
    parser.add_argument(
        '-s',
        '--source',
        required=True,
        help='Source directory where the media data is. Subdirectories "SSS","3DoF" and "Video" are expected to be inside.'
        )
    parser.add_argument(
        '-c',
        '--conf_file',
        required=False,
        help='JSON file with the streaming configuration.'
    )
    parser.add_argument(
        '-o',
        '--output',
        required=False,
        help='Specifies the ffmpeg command output, can be a local directory or an API endpoint.'
    )
    parser.add_argument(
        '-r',
        '--realtime',
        action='store_true',
        help='Whether to generate the files in real-time or not.'
    )
    # Parse CLI params and pass them to main
    main(**vars(parser.parse_args()))