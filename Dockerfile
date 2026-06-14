# 1. Base image jisme pehle se Node aur Playwright ke saare browsers installed hain
FROM mcr.microsoft.com/playwright:v1.44.0-jammy

# 2. App directory banana
WORKDIR /usr/src/app

# 3. package.json ko copy karna aur dependencies install karna
COPY package*.json ./
RUN npm install

# 4. Baaki saara code copy karna
COPY . .

# 5. Port expose karna jo Render use karega
EXPOSE 3000

# 6. Server start karne ki command
CMD [ "node", "server.js" ]
