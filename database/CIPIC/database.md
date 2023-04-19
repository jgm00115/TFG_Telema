# Base de datos de HRTF para espacialización
Para la confección de la base de datos se ha empleado el sujeto 019 de la base de datos de [HRTF del CIPIC](https://github.com/amini-allight/cipic-hrtf-database).

En total se disponen de 1250 respuestas al impulso almacenadas en el fichero `hrir_subject_019.mat` dentro de este directorio.

Para rellenar la base de datos se usa el script `populate.py` que lee cada una de las respuestas, remapea las coordenadas como se describe en este documento, resamplea a 48 KHz y envia al endpoint `/hrtf/` encargado de recibir en JSON cada respuesta, validar el modelo y almacenarlo en la base de datos.

## Remapeo de coordenadas HRTF
La base de datos del CIPIC define las coordenadas azimuth $\phi$ y elevación $\theta$ en grados de las HRTF sampleadas de tal forma que:

$\phi \in [-90,90]$

$\theta \in [-90, 270]$

A la hora de que el usuario interactue con la interfaz y rote la posición en la que está mirando, estas coordenadas dificultan hacer esta operación si algunas fuentes quedan a la espalda.

Es mucho más cómodo transformar el sistema coordenado de tal forma que:

$\phi \in [-180,180]$

$\theta \in [-90, 90]$

Cumpliéndose que:

* (0,0) es un punto situado en frente
* (0,-45) es un punto situado directamente abajo
* (20,0) es un punto situado a la derecha
* (-20,0) es un punto situado a la izquierda

Y además:

* (0,230) = (180,-50)
* (20,180) = (-160,0)
* (-20,180) = (160,0)

Esta transformación es, básicamente:

 $$ \forall \theta > 90º
\rightarrow 
\begin{cases}
  \begin{aligned}
    \phi' = sign(\phi + \epsilon)(|\phi| - 180) \\
    \theta' = 180 - \theta \\
  \end{aligned} \\
\end{cases}$$

Siendo $\epsilon$ la menor diferencia posible entre dos números de coma flotante, ya que $sign(0) = 0$.

## Resampling HRTF
Las frecuencia de muestreo de las respuestas al impulso es de 44.1 KHz. Por defecto, el Audio Context de Web Audio API emplea una frecuencia de muestreo de 48 KHz y resamplea archivos de audio que no coinciden con esta.

Debido a que las HRTF se envian en JSON en lugar de en un .wav, este resampling no se produce, por lo que en la confección de la base de datos se ha resampleado manualmente todas las respuestas al impulso a 48 KHz.

## Identificación de cada HRTF
En el modelo definido en [/server/models/hrtf.js](https://github.com/jgm00115/TFG_Telema/blob/main/server/models/hrtf.js) se usa un índice único compuesto por las coordenadas de azimuth y elevación. 

Esto significa que no puede haber dos respuestas con las mismas coordenadas espaciales y, por lo tanto, permite identificar de forma unívoca cada HRTF.