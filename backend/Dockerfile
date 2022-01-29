FROM python:3.8-alpine

WORKDIR /app

COPY requirements.txt ./

RUN apk add --no-cache \
  g++ \
  musl-dev \
  libffi-dev

RUN pip3 install -r requirements.txt --no-cache-dir \
  && apk del \
  g++ \
  musl-dev \
  libffi-dev

COPY . .

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:80", "app:app"]