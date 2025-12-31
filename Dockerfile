FROM python:3.11-slim

# Install system dependencies and amass
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    unzip \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install amass binary from GitHub releases
RUN wget -q https://github.com/owasp-amass/amass/releases/download/v4.2.0/amass_Linux_amd64.zip -O /tmp/amass.zip \
    && unzip /tmp/amass.zip -d /tmp/amass \
    && mv /tmp/amass/amass_Linux_amd64/amass /usr/local/bin/amass \
    && chmod +x /usr/local/bin/amass \
    && rm -rf /tmp/amass.zip /tmp/amass

# Verify amass installation
RUN amass -version || echo "Amass installed"

WORKDIR /app

# Copy requirements first (for Docker layer caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY server.py .

# Render sets PORT automatically
ENV HOST=0.0.0.0
ENV PYTHONUNBUFFERED=1
EXPOSE 8000

CMD ["python", "server.py"]
