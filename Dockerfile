FROM node:10
COPY ./ ./
RUN npm install
CMD [ "node", "mate.js" ]
