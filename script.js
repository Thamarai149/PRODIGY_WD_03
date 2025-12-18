class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.isAIMode = true;
        this.humanPlayer = 'X';
        this.aiPlayer = 'O';
        this.cells = document.querySelectorAll('.cell');
        this.currentPlayerElement = document.getElementById('current-player');
        this.gameStatusElement = document.getElementById('game-status');
        this.resetButton = document.getElementById('reset-btn');
        this.modeButton = document.getElementById('mode-btn');
        
        this.winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];
        
        this.initializeGame();
    }
    
    initializeGame() {
        this.cells.forEach((cell, index) => {
            cell.addEventListener('click', () => this.handleCellClick(index));
        });
        
        this.resetButton.addEventListener('click', () => this.resetGame());
        this.modeButton.addEventListener('click', () => this.toggleMode());
        this.updateDisplay();
    }
    
    handleCellClick(index) {
        if (this.board[index] !== '' || !this.gameActive) {
            return;
        }
        
        // Human player move
        if (this.isAIMode && this.currentPlayer === this.humanPlayer) {
            this.makeMove(index);
            this.checkGameStatus();
            
            if (this.gameActive) {
                this.switchPlayer();
                // AI move after a short delay
                setTimeout(() => this.makeAIMove(), 500);
            }
        } else if (!this.isAIMode) {
            // Two player mode
            this.makeMove(index);
            this.checkGameStatus();
            
            if (this.gameActive) {
                this.switchPlayer();
            }
        }
    }
    
    makeMove(index) {
        this.board[index] = this.currentPlayer;
        const cell = this.cells[index];
        cell.textContent = this.currentPlayer;
        cell.classList.add('taken', this.currentPlayer.toLowerCase());
    }
    
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateDisplay();
    }
    
    checkGameStatus() {
        let roundWon = false;
        
        for (let condition of this.winningConditions) {
            const [a, b, c] = condition;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                roundWon = true;
                this.highlightWinningCells(condition);
                break;
            }
        }
        
        if (roundWon) {
            if (this.isAIMode) {
                const winner = this.currentPlayer === this.humanPlayer ? 'You Win!' : 'AI Wins!';
                this.gameStatusElement.textContent = winner;
            } else {
                this.gameStatusElement.textContent = `Player ${this.currentPlayer} Wins!`;
            }
            this.gameStatusElement.classList.add('winner');
            this.gameActive = false;
            return;
        }
        
        if (!this.board.includes('')) {
            this.gameStatusElement.textContent = "It's a Draw!";
            this.gameStatusElement.classList.add('draw');
            this.gameActive = false;
            return;
        }
    }
    
    makeAIMove() {
        if (!this.gameActive || this.currentPlayer !== this.aiPlayer) {
            return;
        }
        
        const bestMove = this.getBestMove();
        this.makeMove(bestMove);
        this.checkGameStatus();
        
        if (this.gameActive) {
            this.switchPlayer();
        }
    }
    
    getBestMove() {
        let bestScore = -Infinity;
        let bestMove = 0;
        
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                this.board[i] = this.aiPlayer;
                let score = this.minimax(this.board, 0, false);
                this.board[i] = '';
                
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        
        return bestMove;
    }
    
    minimax(board, depth, isMaximizing) {
        let result = this.checkWinner(board);
        
        if (result !== null) {
            if (result === this.aiPlayer) return 10 - depth;
            if (result === this.humanPlayer) return depth - 10;
            return 0; // Draw
        }
        
        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = this.aiPlayer;
                    let score = this.minimax(board, depth + 1, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = this.humanPlayer;
                    let score = this.minimax(board, depth + 1, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }
    
    checkWinner(board) {
        for (let condition of this.winningConditions) {
            const [a, b, c] = condition;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        
        if (!board.includes('')) {
            return 'draw';
        }
        
        return null;
    }
    
    highlightWinningCells(winningCondition) {
        winningCondition.forEach(index => {
            this.cells[index].style.background = '#90EE90';
        });
    }
    
    updateDisplay() {
        if (this.isAIMode) {
            this.currentPlayerElement.textContent = this.currentPlayer === this.humanPlayer ? 'Your Turn' : 'AI Turn';
        } else {
            this.currentPlayerElement.textContent = this.currentPlayer;
        }
    }
    
    toggleMode() {
        this.isAIMode = !this.isAIMode;
        this.modeButton.textContent = this.isAIMode ? 'vs AI' : '2 Players';
        this.resetGame();
    }
    
    resetGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.className = 'cell';
            cell.style.background = '';
        });
        
        this.gameStatusElement.textContent = '';
        this.gameStatusElement.className = 'game-status';
        this.updateDisplay();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});