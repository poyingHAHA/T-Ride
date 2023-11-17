#!/usr/bin/env bash
NAME="t-ride-db"
PASSWORD="password"
PORT=5432

docker run -p $PORT:5432 -d --name "$NAME" --rm -e POSTGRES_PASSWORD="$PASSWORD" postgres
if [[ $? -ne 0 ]]; then
    echo "db is already running"
    exit
fi

docker cp create.sql $NAME:/create.sql
echo "wait for a while"
sleep 3
docker exec -u postgres $NAME bash -c "psql < /create.sql"
echo "finish creating database"
