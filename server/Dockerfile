FROM node:18

# Crea directorio de la aplicación
WORKDIR /usr/src/app

# Copia el package.json y el package-loc.json e instala dependencias
COPY package*.json ./

RUN npm install

# Copia todos al directorio de trabajo (salvo los que aparecen en el .dockerignore)

COPY . .

# El servidor escucha en el puerto 8080

EXPOSE 8080

CMD ["node","main.js"]