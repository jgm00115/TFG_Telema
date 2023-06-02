#!/Users/jaimegarcia/miniconda3/envs/head/bin/python
import requests, os, json
import numpy as np
from scipy.io import loadmat
from scipy.signal import resample_poly

def remap_coords (azimuth,elevation):
    eps = np.finfo(float).eps

    if (elevation > 90):
        azimuth = np.sign(azimuth + eps)*180 - azimuth
        elevation = 180 - elevation
    
    return azimuth, elevation

def main(api_endpoint):
    # Importa HRTF
    matpath = os.path.join(os.path.dirname(__file__),'hrir_subject_019.mat')
    mat = loadmat(matpath)
    hrir_l = mat['hrir_l']
    hrir_r = mat['hrir_r']
    hrir_length = hrir_l.shape[-1]
    # Coordenadas HRTF
    azimuths = np.hstack([np.array([-80, -65, -55]),
                          np.arange(-45,45+1,5),np.array([55,65,80])])
    elevations = -45 + 5.625*np.arange(0,50)

    # Calcula up/down para el resample
    sr = int(48e3)  # Frecuencia de muestreo deseada
    cipic_sr = int(44.1e3)
    up = sr/np.gcd(sr,cipic_sr)
    down = cipic_sr/np.gcd(sr,cipic_sr)
    print ('Resample up/down = {up}/{down}')

    # Itera por cada HRTF
    H = np.zeros([hrir_length,2])
    remap_azimuths = set()
    remap_elevations = set()
    for az_index in range(0,len(azimuths)):
        for el_index in range(0,len(elevations)):
            # Coordenadas CIPIC
            az = azimuths[az_index]
            el = elevations[el_index]
            # Remap
            az_remap, el_remap = remap_coords(az,el)
            print('''Procesando HRTF coordenadas ({},{}) -> ({},{})'''.format(
                az,el,az_remap,el_remap))
            remap_azimuths.add(az_remap)
            remap_elevations.add(el_remap)
            # Columna = canal
            H[:,0] = np.squeeze(hrir_l[az_index,el_index,:])
            H[:,1] = np.squeeze(hrir_r[az_index,el_index,:])
            # Resample
            G = resample_poly(H,up,down, axis=0)
            # Datos para enviar a la API
            hrtf = {
                'azimuth': float(az_remap),
                'elevation': float(el_remap),
                'left': G[:,0].tolist(),
                'right': G[:,1].tolist(),
            }
            # Envia peticion POST
            requests.post(api_endpoint, json=hrtf)


if __name__ == '__main__':
    api_endpoint = 'http://localhost:8080/hrtf/'
    main(api_endpoint)
