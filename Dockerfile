FROM node:18

# Install ffmpeg + wget
RUN apt-get update && apt-get install -y ffmpeg wget

# App folder
WORKDIR /app

# Copy files
COPY . .

# Install yt-dlp
RUN wget https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -O yt-dlp && \
    chmod +x yt-dlp

# Install node modules
RUN npm install

# Start app
CMD ["node", "index.js"]