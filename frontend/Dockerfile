# Usa imagen de nginx
FROM nginx:alpine

# Borrar contenido(opcional)
RUN rm -rf /usr/share/nginx/html/*

# Copiar archivos estáticos al directorio donde nginx sirve
COPY . /usr/share/nginx/html

# configuración personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

