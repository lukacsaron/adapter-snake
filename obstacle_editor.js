document.addEventListener('DOMContentLoaded', function() {
    const canvasContainer = document.getElementById('canvasContainer');
    const editorCanvas = document.getElementById('editorCanvas');
    let obstacles = [];
    let currentObstacle = null;
    let isDragging = false;
    let isResizing = false;
    let startX, startY, startWidth, startHeight;

    function addObstacleEventListener(element) {
        element.addEventListener('mousedown', function(e) {
            if (e.target === element) {
                // Create a new obstacle
                currentObstacle = createObstacle(e.clientX, e.clientY);
                obstacles.push(currentObstacle);
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
            } else if (e.target.classList.contains('resize-handle')) {
                // Start resizing
                isResizing = true;
                currentObstacle = e.target.parentNode;
                startX = e.clientX;
                startY = e.clientY;
                startWidth = currentObstacle.offsetWidth;
                startHeight = currentObstacle.offsetHeight;
                e.stopPropagation();
            } else {
                // Start dragging
                isDragging = true;
                currentObstacle = e.target;
                startX = e.clientX - currentObstacle.offsetLeft;
                startY = e.clientY - currentObstacle.offsetTop;
            }
        });
    }

    addObstacleEventListener(canvasContainer);
    addObstacleEventListener(editorCanvas);

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            moveObstacle(e.clientX, e.clientY);
        } else if (isResizing) {
            resizeObstacle(e.clientX, e.clientY);
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
        isResizing = false;
        currentObstacle = null;
    });

    function createObstacle(x, y) {
        const obstacle = document.createElement('div');
        obstacle.className = 'obstacle';
        obstacle.style.left = x + 'px';
        obstacle.style.top = y + 'px';
        obstacle.style.width = '100px';
        obstacle.style.height = '100px';

        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'resize-handle';
        obstacle.appendChild(resizeHandle);

        canvasContainer.appendChild(obstacle);
        return obstacle;
    }

    function moveObstacle(x, y) {
        if (!currentObstacle) return;
        currentObstacle.style.left = (x - startX) + 'px';
        currentObstacle.style.top = (y - startY) + 'px';
    }

    function resizeObstacle(x, y) {
        if (!currentObstacle) return;
        const newWidth = Math.max(20, startWidth + x - startX);
        const newHeight = Math.max(20, startHeight + y - startY);
        currentObstacle.style.width = newWidth + 'px';
        currentObstacle.style.height = newHeight + 'px';
    }

    document.getElementById('exportButton').addEventListener('click', function() {
        const exportedObstacles = obstacles.map(obstacle => {
            const rect = obstacle.getBoundingClientRect();
            const containerRect = canvasContainer.getBoundingClientRect();
            return {
                x: Math.round(rect.left - containerRect.left),
                y: Math.round(rect.top - containerRect.top),
                width: Math.round(rect.width),
                height: Math.round(rect.height)
            };
        });
        console.log('obstacles = ' + JSON.stringify(exportedObstacles, null, 4));
        alert('Obstacles exported to console.');
    });
    
});
