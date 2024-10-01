# Project variables
PROJECT_NAME = my_project
COMPOSE_FILE = docker-compose.yml

# Docker Compose commands
DC_BUILD = docker-compose -f $(COMPOSE_FILE) build # --progress=plain
DC_UP = docker-compose -f $(COMPOSE_FILE) up -d
DC_DOWN = docker-compose -f $(COMPOSE_FILE) down
DC_STOP = docker-compose -f $(COMPOSE_FILE) stop
DC_START = docker-compose -f $(COMPOSE_FILE) start
DC_RESTART = docker-compose -f $(COMPOSE_FILE) restart
DC_LOGS = docker-compose -f $(COMPOSE_FILE) logs #-f
DC_RUN = docker-compose -f $(COMPOSE_FILE) run

# Default target: Build and start all services
all: build up

# Build the Docker images
build:
	$(DC_BUILD)

# Run Django migrations
migration:
	$(DC_RUN) backend python manage.py showmigrations
	$(DC_RUN) backend python manage.py makemigrations project
	$(DC_RUN) backend python manage.py migrate

# Start the containers in detached mode
up:
	$(DC_UP)
#$(MAKE) migration

# Stop the containers
stop:
	$(DC_STOP)

# Start the containers again
start:
	$(DC_START)

# Restart the containers
restart:
	$(DC_RESTART)

# View logs
logs:
	$(DC_LOGS)

# Bring down the containers and remove volumes
down:
	$(DC_DOWN) --volumes

# Create a Django superuser
createsuperuser:
	$(DC_RUN) backend python manage.py createsuperuser

# Clean up unused Docker images and containers
clean:
	docker system prune -f
	docker volume prune -f

# Tail the logs for the backend service
logs-backend:
	$(DC_LOGS) backend

# Tail the logs for the frontend service
logs-frontend:
	$(DC_LOGS) frontend

re: down clean all


# POSTGRES
db-access:
	docker-compose exec db psql -U myuser -d mydatabase

db-show-tables:
	docker-compose exec db psql -U myuser -d mydatabase -c "\dt"

db-auth-table:
	docker-compose exec db psql -U myuser -d mydatabase -c "SELECT * FROM project_user;"

.PHONY: all build migration up stop start restart logs down createsuperuser clean logs-backend logs-frontend re db-access db-show-tables db-auth-table