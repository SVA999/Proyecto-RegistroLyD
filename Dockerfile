# Usamos la imagen base de Nginx
FROM nginx:alpine

# Eliminamos la config por defecto
RUN rm -rf /usr/share/nginx/html/*

# Copiamos la carpeta build/dist generada por React al directorio de Nginx
COPY dist /usr/share/nginx/html

# Exponemos el puerto 80
EXPOSE 80

# Levantamos Nginx
CMD ["nginx", "-g", "daemon off;"]
