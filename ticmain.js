 let currentPlayer = 'X';
        let gameBoard = [];
        let gameActive = true;
        let scores = { X: 0, O: 0 };
        let isDarkMode = false;
        let boardSize = 3;
        let winningConditions = [];
        
        // Initialize game
        function initGame() {
            createParticles();
            updateScoreDisplay();
            
            // Theme toggle
            document.getElementById('themeToggle').addEventListener('click', toggleTheme);
            
            // Check for saved theme preference
            if (localStorage.getItem('theme') === 'dark') {
                document.documentElement.setAttribute('data-theme', 'dark');
                document.getElementById('themeToggle').textContent = '☀️';
                isDarkMode = true;
            }
            
            // Game mode selector
            const modeButtons = document.querySelectorAll('.mode-btn');
            modeButtons.forEach(button => {
                button.addEventListener('click', function() {
                    modeButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    boardSize = parseInt(this.dataset.size);
                    initializeBoard();
                });
            });
            
            // Initialize the board
            initializeBoard();
        }
        
        // Initialize the game board
        function initializeBoard() {
            const gameBoardElement = document.getElementById('gameBoard');
            gameBoardElement.innerHTML = '';
            gameBoardElement.className = `game-board board-${boardSize}x${boardSize}`;
            
            // Initialize game board array
            gameBoard = Array(boardSize * boardSize).fill('');
            
            // Create cells
            for (let i = 0; i < boardSize * boardSize; i++) {
                const cell = document.createElement('button');
                cell.className = 'cell';
                cell.dataset.index = i;
                cell.addEventListener('click', handleCellClick);
                gameBoardElement.appendChild(cell);
            }
            
            // Set winning conditions based on board size
            setWinningConditions();
            
            // Reset game state
            gameActive = true;
            currentPlayer = 'X';
            updateCurrentPlayerDisplay();
        }
        
        // Set winning conditions based on board size
        function setWinningConditions() {
            winningConditions = [];
            
            // Rows
            for (let i = 0; i < boardSize; i++) {
                const row = [];
                for (let j = 0; j < boardSize; j++) {
                    row.push(i * boardSize + j);
                }
                winningConditions.push(row);
            }
            
            // Columns
            for (let i = 0; i < boardSize; i++) {
                const col = [];
                for (let j = 0; j < boardSize; j++) {
                    col.push(j * boardSize + i);
                }
                winningConditions.push(col);
            }
            
            // Diagonals
            const diag1 = [];
            const diag2 = [];
            for (let i = 0; i < boardSize; i++) {
                diag1.push(i * boardSize + i);
                diag2.push(i * boardSize + (boardSize - 1 - i));
            }
            winningConditions.push(diag1, diag2);
        }
        
        // Toggle theme
        function toggleTheme() {
            isDarkMode = !isDarkMode;
            if (isDarkMode) {
                document.documentElement.setAttribute('data-theme', 'dark');
                document.getElementById('themeToggle').textContent = '☀️';
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.removeAttribute('data-theme');
                document.getElementById('themeToggle').textContent = '🌙';
                localStorage.setItem('theme', 'light');
            }
        }
        
        // Create particles
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 15 + 's';
                particle.style.animationDuration = (15 + Math.random() * 10) + 's';
                particlesContainer.appendChild(particle);
            }
        }
        
        // Handle cell click
        function handleCellClick(event) {
            const cell = event.target;
            const index = parseInt(cell.dataset.index);
            
            if (gameBoard[index] !== '' || !gameActive) {
                return;
            }
            
            gameBoard[index] = currentPlayer;
            updateCell(cell, currentPlayer);
            checkResult();
        }
        
        // Update cell with pixelated X or O
        function updateCell(cell, player) {
            cell.classList.add('taken', player.toLowerCase());
            
            if (player === 'X') {
                cell.innerHTML = `
                    <div class="pixel-x">
                        <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
                        <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
                        <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
                        <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
                        <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
                        <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
                        <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
                    </div>
                `;
            } else {
                cell.innerHTML = `
                    <div class="pixel-o">
                        <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
                        <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
                        <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
                        <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
                        <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
                        <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
                        <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
                    </div>
                `;
            }
        }
        
        // Check for win or draw
        function checkResult() {
            let roundWon = false;
            let winningCombination = [];
            
            for (let i = 0; i < winningConditions.length; i++) {
                const condition = winningConditions[i];
                let match = true;
                
                for (let j = 0; j < condition.length; j++) {
                    if (gameBoard[condition[j]] !== currentPlayer) {
                        match = false;
                        break;
                    }
                }
                
                if (match) {
                    roundWon = true;
                    winningCombination = condition;
                    break;
                }
            }
            
            if (roundWon) {
                gameActive = false;
                scores[currentPlayer]++;
                updateScoreDisplay();
                highlightWinningCells(winningCombination);
                
                // Trigger destruction animation and celebration
                setTimeout(() => {
                    destroyBoard();
                    celebrate();
                    setTimeout(() => {
                        showWinnerMessage(`Player ${currentPlayer} Wins!`);
                    }, 1000);
                }, 500);
                return;
            }
            
            if (!gameBoard.includes('')) {
                gameActive = false;
                setTimeout(() => {
                    destroyBoard();
                    celebrate();
                    setTimeout(() => {
                        showWinnerMessage("It's a Draw!");
                    }, 1000);
                }, 500);
                return;
            }
            
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updateCurrentPlayerDisplay();
        }
        
        // Destroy board animation
        function destroyBoard() {
            const cells = document.querySelectorAll('.cell');
            cells.forEach((cell, index) => {
                setTimeout(() => {
                    cell.classList.add('destroy');
                }, index * 30);
            });
        }
        
        // Celebrate with confetti and fireworks
        function celebrate() {
            // Create confetti
            for (let i = 0; i < 100; i++) {
                setTimeout(() => {
                    createConfetti();
                }, i * 30);
            }
            
            // Create fireworks
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    createFirework();
                }, i * 400);
            }
        }
        
        // Create confetti
        function createConfetti() {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
            confetti.style.width = Math.random() * 10 + 5 + 'px';
            confetti.style.height = confetti.style.width;
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }
        
        // Create firework
        function createFirework() {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight / 2;
            const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
            
            for (let i = 0; i < 30; i++) {
                const firework = document.createElement('div');
                firework.className = 'firework';
                firework.style.left = x + 'px';
                firework.style.top = y + 'px';
                firework.style.background = colors[Math.floor(Math.random() * colors.length)];
                
                const angle = (Math.PI * 2 * i) / 30;
                const velocity = 50 + Math.random() * 50;
                const tx = Math.cos(angle) * velocity;
                const ty = Math.sin(angle) * velocity;
                
                firework.style.animation = 'none';
                firework.style.transform = `translate(${tx}px, ${ty}px)`;
                firework.style.transition = 'all 1.5s ease-out';
                firework.style.opacity = '0';
                
                document.body.appendChild(firework);
                
                setTimeout(() => {
                    firework.remove();
                }, 1500);
            }
        }
        
        // Highlight winning cells
        function highlightWinningCells(cells) {
            cells.forEach(index => {
                document.querySelector(`[data-index="${index}"]`).style.background = 
                    'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)';
            });
        }
        
        // Update current player display
        function updateCurrentPlayerDisplay() {
            const display = document.getElementById('currentPlayer');
            display.textContent = `Player ${currentPlayer}'s Turn`;
            display.style.animation = 'none';
            setTimeout(() => {
                display.style.animation = 'pulse 0.5s ease';
            }, 10);
        }
        
        // Update score display
        function updateScoreDisplay() {
            document.getElementById('scoreX').textContent = scores.X;
            document.getElementById('scoreO').textContent = scores.O;
        }
        
        // Show winner message
        function showWinnerMessage(message) {
            document.getElementById('winnerText').textContent = message;
            document.getElementById('overlay').classList.add('show');
            document.getElementById('winnerMessage').classList.add('show');
        }
        
        // Close winner message
        function closeWinnerMessage() {
            document.getElementById('overlay').classList.remove('show');
            document.getElementById('winnerMessage').classList.remove('show');
            resetGame();
        }
        
        // Reset game
        function resetGame() {
            gameBoard = Array(boardSize * boardSize).fill('');
            gameActive = true;
            currentPlayer = 'X';
            
            const cells = document.querySelectorAll('.cell');
            cells.forEach(cell => {
                cell.innerHTML = '';
                cell.classList.remove('taken', 'x', 'o', 'destroy');
                cell.style.background = '';
            });
            
            updateCurrentPlayerDisplay();
        }
        
        // New game
        function newGame() {
            scores = { X: 0, O: 0 };
            updateScoreDisplay();
            resetGame();
        }
        
        // Initialize the game when DOM is loaded
        document.addEventListener('DOMContentLoaded', initGame);