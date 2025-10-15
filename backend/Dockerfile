FROM node:18-alpine

WORKDIR /app

# Copiar solo los archivos de dependencias primero (para caché eficiente)
COPY package*.json ./

# Instalar dependencias
RUN npm install --only=production

# Copiar el código fuente
COPY . .

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD ["node", "src/index.js"]
