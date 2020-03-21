FROM stain/jena-fuseki
COPY . .
RUN '/jena-fuseki/fuseki-server'

# node slim image
FROM node:12.10.0-slim
WORKDIR /usr/src/server

# installing packages
COPY ./package*.json ./
RUN npm install --quiet

# copy files
COPY . .
# start dev server
CMD ["npm", "start"]