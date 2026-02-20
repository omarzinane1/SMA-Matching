# Backend avec Flask
FROM python:3.11-slim

WORKDIR /app

# Install dependencies pour compiler certains packages
RUN apt-get update && \
    apt-get install -y build-essential libffi-dev libssl-dev curl && \
    rm -rf /var/lib/apt/lists/*

# Copy requirements et installer Python packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Expose Flask port
EXPOSE 5000

# Run Flask
CMD ["python", "app.py"]
