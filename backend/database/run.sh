NAME="t-ride-db"
PASSWORD="password"
PORT=5432

docker run -p $PORT:5432 -d --name "$NAME" --rm -e POSTGRES_PASSWORD="$PASSWORD" postgres
docker cp create.sql $NAME:/create.sql
echo "wait for a second"
sleep 3
docker exec -u postgres $NAME bash -c "psql < /create.sql"
echo "finish creating database"
