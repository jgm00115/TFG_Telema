#!/Users/jaimegarcia/miniconda3/envs/head/bin/python
import requests, os, json
import numpy as np
from scipy.io import loadmat
from scipy.signal import resample_poly


def main(api_endpoint):
    # Importe HRTF
    matpath = os.path.join(os.path.dirname(__file__),'ord02_BiMagLS.mat')
    mat = loadmat(matpath)
    hrir = np.array(mat['hnm'])
    hrir = np.swapaxes(hrir,0,2)
    hrir_l = np.array(hrir[0,:,:])
    hrir_r = np.array(hrir[1,:,:])
    hrir_length = hrir.shape[-1]
    fs = mat['fs']
    # HRTF orders
    num_hrtfs = hrir.shape[1]
    order = int(np.sqrt(num_hrtfs)-1)
    order_range = np.arange(order+1)
    
    #azimuths = np.hstack([np.array([-80, -65, -55]),
    #                      np.arange(-45,45+1,5),np.array([55,65,80])])
    #elevations = -45 + 5.625*np.arange(0,50)

    # if statement to check if the sampling frequency is 48 kHz and resample accordingly
    if(fs != int(48e3)):
        fs = int(48e3)  # Desired sampling frequency
        cipic_fs = int(44.1e3)
        up = fs/np.gcd(fs,cipic_fs)
        down = cipic_fs/np.gcd(fs,cipic_fs)
        print ('Resample up/down = {up}/{down}')
    else:
        fs = int(48e3)  # Desired sampling frequency
    
    # Iterate for each HRTF 
    H = np.zeros([hrir_length,2])
   
    for ord_index in np.arange(0,order+1,1):
        deg_range = np.arange(-order_range[ord_index],order_range[ord_index]+1,1)
        for deg_index in range(0,len(deg_range)):
            deg = deg_range[deg_index]
            print('''Processing HRTF of order {} degree {}'''.format(
                ord_index,deg))
            # Column = channel
            h_index = ord_index**2 + ord_index + deg
            H[:,0] = np.squeeze(hrir_l[h_index,:])
            H[:,1] =  np.squeeze(hrir_r[h_index,:])
            # Resample
            if(fs != int(48e3)):
                G = resample_poly(H,up,down, axis=0)
            else:
                G = H
            # Data to send to the API
            hrtf = {
                'order': int(ord_index),
                'degree': int(deg),
                'left': G[:,0].tolist(),
                'right': G[:,1].tolist(),
                'samplerate': fs
            } 
            # Send POST request
            requests.post(api_endpoint, json=hrtf)
            

if __name__ == '__main__':
    api_endpoint = 'http://localhost:8080/ambiHrtf/'
    main(api_endpoint)
