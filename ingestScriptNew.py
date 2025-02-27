#!/usr/bin/env python3
import subprocess
import os

def reencode_videos(video_files, output_dir):
    reencoded_files = []
    for video in video_files:
        output_file = os.path.join(output_dir, os.path.basename(video).replace('.mp4', '_reenc.mp4'))
        cmd = [
            "ffmpeg", "-y", "-i", video, "-c:v", "libx265",
            "-x265-params", "keyint=120:min-keyint=120:scenecut=0",
            "-an", output_file
        ]
        print("Re-encoding video:", " ".join(cmd))
        subprocess.run(cmd)
        reencoded_files.append(output_file)
    return reencoded_files

def create_video_dash(video_files, output_dir):
    cmd = [
        "MP4Box", "-dash", "4000", "-frag", "4000", "-rap",
        "-profile", "onDemand",
        "-out", os.path.join(output_dir, "video_manifest.mpd")
    ] + video_files
    print("Running MP4Box for videos:", " ".join(cmd))
    subprocess.run(cmd)

def create_audio_dash(audio_files, output_dir):
    cmd = ["ffmpeg", "-y"]
    for i, audio in enumerate(audio_files):
        cmd += ["-i", audio]

    for i in range(len(audio_files)):
        cmd += [
            "-map", f"{i}:a",
            "-c:a", "libopus",
            "-vn",
            "-f", "dash",
            "-seg_duration", "4",
            os.path.join(output_dir, f"audio_stream{i}.mpd")
        ]
    print("Running FFmpeg for audio DASH:", " ".join(cmd))
    subprocess.run(cmd)

def combine_manifests(video_mpd, audio_mpds, output_dir):
    final_mpd = os.path.join(output_dir, "combined_manifest.mpd")
    with open(video_mpd, 'r') as v_mpd:
        video_manifest = v_mpd.read()

    audio_adaptation_sets = ""
    for audio_mpd in audio_mpds:
        with open(audio_mpd, 'r') as a_mpd:
            audio_content = a_mpd.read()
            adaptation_set = audio_content.split("<AdaptationSet")[1].split("</AdaptationSet>")[0]
            audio_adaptation_sets += f"<AdaptationSet{adaptation_set}</AdaptationSet>\n"

    combined_mpd = video_manifest.replace("</Period>", audio_adaptation_sets + "</Period>")
    with open(final_mpd, 'w') as final:
        final.write(combined_mpd)
    print(f"Combined manifest created at {final_mpd}")

def main():
    video_files = [
        "/Users/christopherditchburn/Downloads/CAM02-TIMPANI_8k_dash_libx265.mp4",
        "/Users/christopherditchburn/Downloads/CAM01-CONDUCTOR_8k_dash_libx265.mp4",
        "/Users/christopherditchburn/Downloads/CAM03-BALCONY_8k_dash_libx265.mp4",
        "/Users/christopherditchburn/Downloads/CAM04-SIDESTALLS_8k_dash_libx265.mp4",
    ]

    audio_files = [
        '/Users/christopherditchburn/Spork/TFG_Telema/audio/Unaligned/AS.wav',
        '/Users/christopherditchburn/Spork/TFG_Telema/audio/Unaligned/CB_A.wav',
        '/Users/christopherditchburn/Spork/TFG_Telema/audio/Unaligned/CL.wav',
        '/Users/christopherditchburn/Spork/TFG_Telema/audio/Unaligned/FG.wav',
        '/Users/christopherditchburn/Spork/TFG_Telema/audio/Unaligned/FL.wav',
        '/Users/christopherditchburn/Spork/TFG_Telema/audio/Unaligned/HR.wav',
        '/Users/christopherditchburn/Spork/TFG_Telema/audio/Unaligned/OB.wav',
        '/Users/christopherditchburn/Spork/TFG_Telema/audio/Unaligned/TB.wav',
        '/Users/christopherditchburn/Spork/TFG_Telema/audio/Unaligned/TI.wav',
        '/Users/christopherditchburn/Spork/TFG_Telema/audio/Unaligned/TM.wav',
        '/Users/christopherditchburn/Spork/TFG_Telema/audio/Unaligned/TR.wav',
        '/Users/christopherditchburn/Spork/TFG_Telema/audio/Unaligned/TU.wav',
        '/Users/christopherditchburn/Spork/TFG_Telema/audio/Unaligned/VC.wav',
        '/Users/christopherditchburn/Spork/TFG_Telema/audio/Unaligned/VN_I.wav',
        '/Users/christopherditchburn/Spork/TFG_Telema/audio/Unaligned/VN_II.wav',
        '/Users/christopherditchburn/Spork/TFG_Telema/audio/Unaligned/MAIN.wav',
        '/Users/christopherditchburn/Spork/TFG_Telema/audio/3DOF/POS1.wav'
    ]

    output_dir = "./dash_output"
    os.makedirs(output_dir, exist_ok=True)

    # Step 1: Re-encode videos
    # reencoded_videos = reencode_videos(video_files, output_dir)

    # Step 2: Create DASH for videos
    create_video_dash(video_files, output_dir)

    # Step 3: Create DASH for audio
    create_audio_dash(audio_files, output_dir)
    audio_mpds = [os.path.join(output_dir, f"audio_stream{i}.mpd") for i in range(len(audio_files))]

    # Step 4: Combine manifests
    combine_manifests(os.path.join(output_dir, "video_manifest.mpd"), audio_mpds, output_dir)

if __name__ == '__main__':
    main()
