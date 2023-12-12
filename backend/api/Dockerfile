FROM python:3.8

COPY . /api

EXPOSE 5239

WORKDIR /api

RUN pip3 install -r requirements.txt

CMD python3 app.py
