import librosa
import os
import numpy as np

def process_sound_files(folder_path):
    # Iterate through each file in the folder
    for file in os.listdir(folder_path):
        # Construct the full file path
        file_path = os.path.join(folder_path, file)
        # Check if the file is a sound file (for simplicity, checking by extension)
        if file_path.endswith(('.mp3', '.wav', '.flac')):
            print("Processing file: " + file_path)
            # Load the sound file
            y, sr = librosa.load(file_path)
            np.savetxt('audio_data_log.txt', y)
            # Calculate the duration of the sound file
            duration = librosa.get_duration(y=y, sr=sr)
            # Calculate the mean volume (amplitude) of the sound file
            db = librosa.amplitude_to_db(np.abs(y), ref=np.max)
            mean_volume = np.mean(db)
            std_volume = np.std(db)
            max_volume = np.max(db)
            
            print(f"File: {file}")
            print(f"Duration: {duration:.2f} seconds")
            print(f"Sampling Rate: {sr}")
            print(f"Mean Volume: {mean_volume:.2f} dB")
            print(f"Volume Standard Deviation: {std_volume:.2f} dB")
            print(f"Max Volume: {max_volume:.2f} dB")
            
            # Check if the loudest point is more than 3 standard deviations away from the mean
            if max_volume > mean_volume + 3*std_volume:
                print("The loudest point is more than 3 standard deviations away from the mean volume.")
            else:
                print("The loudest point is within 3 standard deviations of the mean volume.")
            print("-----")
# Specify the folder where the sound files are located
folder_path = 'soundRecordings'
process_sound_files(folder_path)
