FROM nginx:alpine

# Game assets
COPY snake.html snake.js /usr/share/nginx/html/
COPY obstacle_editor.html obstacle_editor.js template_obstacles.json /usr/share/nginx/html/
COPY intro-placeholder.jpg windows.jpg /usr/share/nginx/html/

# The game is the site root; snake.html stays reachable at its own path too
COPY snake.html /usr/share/nginx/html/index.html

EXPOSE 80
