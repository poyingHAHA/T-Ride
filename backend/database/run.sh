#!/usr/bin/env bash
NAME="t-ride-db"
PORT=5432

read -p "set password: " password

docker run -p $PORT:5432 -d --name "$NAME" -e POSTGRES_PASSWORD="$password" postgres
#docker run -p $PORT:5432 -v $(pwd)/postgresql.conf:/etc/postgresql/postgresql.conf -d --name "$NAME"\
#    --rm -e POSTGRES_PASSWORD="$password" postgres -c 'config_file=/etc/postgresql/postgresql.conf'

if [[ $? -ne 0 ]]; then
    echo "db exists"
    echo "maybe you should \"docker kill $NAME\" and \"docker rm $NAME\""
    exit
fi

docker cp create.sql $NAME:/create.sql
docker cp insert_spot.sql $NAME:/insert_spot.sql
echo "wait for a while"
sleep 3
docker exec -u postgres $NAME bash -c "psql < /create.sql"
docker exec -u postgres $NAME bash -c "psql < /insert_spot.sql"
echo "finish creating database"
