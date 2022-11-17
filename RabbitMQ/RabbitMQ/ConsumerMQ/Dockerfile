FROM node:18.9.0

WORKDIR /usr/src/app

COPY ["package.json","./"]

RUN if [ "$NODE_ENV" = "development" ]; \
        then npm install; \
        else npm install --only=production; \
    fi

RUN apt-get update && apt-get install -y xpdf

RUN apt-get update && apt-get install tesseract-ocr -y

COPY . .

ENV PORT=3000

EXPOSE $PORT

CMD ["node","index.js"]
