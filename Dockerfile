FROM node:10
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/
COPY ./ /opt/app/
CMD [ "node", "/opt/app/mate.js" ]
