FROM python:3.9

WORKDIR /app

COPY requirements.txt ./
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput

# Expose port 8000 and start the server
EXPOSE 8000

CMD ["python", "manage.py", "runsslserver", "0.0.0.0:8000"]