// State Management
let studentName = '';
let currentQuestionIndex = -1;
let userAnswers = []; // {questionId, level, partsCorrect, totalParts, pointsEarned}
let currentSelectedAnswers = [];
let answeredQuestions = new Set();
let totalScore = 0;

// Local Storage Helper
function saveState() {
    const state = {
        studentName,
        totalScore,
        answeredQuestions: Array.from(answeredQuestions),
        userAnswers
    };
    localStorage.setItem('mathQuizState', JSON.stringify(state));
}

function loadState() {
    const saved = localStorage.getItem('mathQuizState');
    if (saved) {
        try {
            const state = JSON.parse(saved);
            studentName = state.studentName || '';
            totalScore = state.totalScore || 0;
            answeredQuestions = new Set(state.answeredQuestions || []);
            userAnswers = state.userAnswers || [];
            return true;
        } catch(e) {
            console.error('Failed to parse quiz state');
        }
    }
    return false;
}

// Clock logic
function startClock() {
    const timeElem = document.getElementById('global-date-time');
    if (!timeElem) return;
    
    function update() {
        const now = new Date();
        timeElem.textContent = now.toLocaleDateString([], {weekday: 'short', month: 'short', day: 'numeric'}) + ' ' + now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
    update();
    setInterval(update, 60000);
}
startClock();

// Jeopardy Points Config
// As per standard Jeopardy style, but specific to this grid configuration
const baseLevelPoints = {
    2: 100,
    3: 200,
    4: 300,
    5: 400
};

// Obfuscation handling
const key = "mathquiz";
function decryptString(b64) {
    try {
        const decoded = atob(b64);
        let result = '';
        for (let i = 0; i < decoded.length; i++) {
            result += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return result;
    } catch (e) {
        return b64;
    }
}

// DOM Elements
const startDiv = document.getElementById('start-screen');
const boardDiv = document.getElementById('board-screen');
const quizDiv = document.getElementById('quiz-screen');
const resultsDiv = document.getElementById('results-screen');
const startForm = document.getElementById('start-form');

const jeopardyBoard = document.getElementById('jeopardy-board');
const finishQuizBtn = document.getElementById('finish-quiz-btn');

const globalHeaderElem = document.getElementById('global-header');
const globalNameElem = document.getElementById('global-student-name');
const globalScoreElem = document.getElementById('global-total-score');
const backToBoardBtn = document.getElementById('back-to-board-btn');

const qCounter = document.getElementById('question-counter');
const levelBadge = document.getElementById('level-badge');
const qImage = document.getElementById('question-image');
const ansContainer = document.getElementById('answer-container');
const submitBtn = document.getElementById('submit-answer-btn');
const progressFill = document.getElementById('progress');

const feedbackOverlay = document.getElementById('feedback-overlay');
const fTitle = document.getElementById('feedback-title');
const fMessage = document.getElementById('feedback-message');
const nextBtn = document.getElementById('next-question-btn');

// Initialize Unit Name
if (typeof unitName !== 'undefined') {
    document.getElementById('unit-name-start').textContent = unitName;
    const boardTitle = document.getElementById('unit-name-board');
    if (boardTitle) boardTitle.textContent = unitName;
    document.getElementById('unit-name-results').textContent = unitName;
}

// On Load check state
document.addEventListener('DOMContentLoaded', () => {
    if (loadState() && studentName) {
        // Restore board
        document.getElementById('display-name') ? document.getElementById('display-name').textContent = studentName : null;
        globalNameElem.textContent = studentName;
        globalScoreElem.textContent = totalScore;
        
        startDiv.classList.remove('active');
        globalHeaderElem.classList.remove('hidden');
        initBoard();
        boardDiv.classList.add('active');
    }
});

// Start Logic
startForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('student-name').value.trim();
    if (nameInput) {
        studentName = nameInput;
        document.getElementById('display-name') ? document.getElementById('display-name').textContent = studentName : null;
        globalNameElem.textContent = studentName;
        globalScoreElem.textContent = totalScore;
        
        startDiv.classList.remove('active');
        globalHeaderElem.classList.remove('hidden');
        initBoard();
        boardDiv.classList.add('active');
        
        saveState();
    }
});

if (backToBoardBtn) {
    backToBoardBtn.onclick = () => {
        // Return to board without recording an answer
        quizDiv.classList.remove('active');
        boardDiv.classList.add('active');
    };
}

// Jeopardy Board Init
function initBoard() {
    jeopardyBoard.innerHTML = ''; // clear existing
    
    // Fallback if benchmarks not defined properly
    const activeBenchmarks = (typeof benchmarks !== 'undefined') ? benchmarks : [];
    
    // Set grid columns based on benchmarks count
    // jeopardyBoard.style.gridTemplateColumns won't be set directly here anymore, we'll rely on CSS.
    // Ensure the board itself uses grid that can adapt.
    
    // Generate Column Wrappers
    activeBenchmarks.forEach(bm => {
        const colDiv = document.createElement('div');
        colDiv.className = 'benchmark-col';
        
        // 1. Header
        const headerCell = document.createElement('div');
        headerCell.className = 'jeopardy-header';
        
        const titleSpan = document.createElement('span');
        titleSpan.textContent = bm.name;
        
        let bmScore = 0;
        if (typeof userAnswers !== 'undefined') {
            bmScore = userAnswers.reduce((sum, ans) => {
                const ansBmId = ans.benchmarkId || quizData.find(q => q.id === ans.id)?.benchmarkId;
                return (ansBmId === bm.id) ? sum + ans.pointsEarned : sum;
            }, 0);
        }
        
        if (bmScore >= 400) {
            const tick = document.createElement('span');
            tick.textContent = ' ✅';
            tick.title = `Score: ${bmScore}`;
            titleSpan.appendChild(tick);
        }
        
        headerCell.appendChild(titleSpan);

        if (bm.tooltip) {
            const descSpan = document.createElement('span');
            descSpan.className = 'benchmark-desc';
            descSpan.textContent = bm.tooltip;
            headerCell.appendChild(descSpan);
        }

        if (bm.videoRefresher) {
            const link = document.createElement('a');
            link.href = bm.videoRefresher;
            link.target = '_blank';
            link.className = 'refresher-link';
            link.textContent = '🎥 Review Video';
            headerCell.appendChild(link);
        }

        colDiv.appendChild(headerCell);

        // 2. Cells (Rows 0-3 for this benchmark)
        const bmQuestions = quizData.filter(q => q.benchmarkId === bm.id).sort((a,b) => a.level - b.level || a.id - b.id);
        
        for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
            const question = bmQuestions[rowIndex];
            
            const cellBtn = document.createElement('button');
            cellBtn.className = 'jeopardy-cell';
            
            if (question) {
                const questionIndex = quizData.indexOf(question);
                
                // Assign derived points based on row (100, 200, 300, 400)
                const questionPoints = (rowIndex + 1) * 100;
                question.derivedPoints = questionPoints;
                
                cellBtn.textContent = questionPoints;
                cellBtn.id = `cell-q-${questionIndex}`;

                if (answeredQuestions.has(questionIndex)) {
                    cellBtn.disabled = true;
                    const ansRecord = userAnswers.find(a => a.id === question.id);
                    const isFullyCorrect = ansRecord && ansRecord.partsCorrect === ansRecord.totalParts;
                    
                    if (isFullyCorrect) {
                        cellBtn.innerHTML = '<span class="cell-tick">✔</span>';
                    } else {
                        cellBtn.innerHTML = '<span class="cell-tick x-tick">✖</span>';
                    }
                } else {
                    cellBtn.onclick = () => loadQuestion(questionIndex);
                }
            } else {
                cellBtn.style.visibility = 'hidden'; 
                cellBtn.disabled = true;
            }

            colDiv.appendChild(cellBtn);
        }
        
        jeopardyBoard.appendChild(colDiv);
    });

    globalScoreElem.textContent = totalScore;
    
    // Sync header heights so they align perfectly
    setTimeout(syncHeaderHeights, 50);
}

function syncHeaderHeights() {
    const headers = document.querySelectorAll('.jeopardy-header');
    if (headers.length === 0) return;
    
    // Reset to auto to find natural height
    headers.forEach(h => h.style.height = 'auto');
    
    let maxHeight = 0;
    headers.forEach(h => {
        const height = h.offsetHeight;
        if (height > maxHeight) maxHeight = height;
    });
    
    // Apply uniform height
    headers.forEach(h => {
        h.style.height = `${maxHeight}px`;
    });
}

// Ensure responsiveness on window resize
window.addEventListener('resize', () => {
    if (boardDiv.classList.contains('active')) {
        syncHeaderHeights();
    }
});

// Load Specific Question
function loadQuestion(index) {
    currentQuestionIndex = index;
    const q = quizData[currentQuestionIndex];
    currentSelectedAnswers = q.parts.map(p => p.type === 'multiselect' ? [] : null);
    submitBtn.disabled = true;

    // Transition UI
    boardDiv.classList.remove('active');
    quizDiv.classList.add('active');

    // Update UI
    qCounter.textContent = `Question from ${benchmarks.find(b => b.id === q.benchmarkId)?.name || 'Board'}`;
    levelBadge.textContent = `Level ${q.level} (${q.derivedPoints || (q.level * 100)} pts)`;
    qImage.src = q.imagePath;
    
    // In Jeopardy mode, progress can reflect total completion percentage
    progressFill.style.width = `${(answeredQuestions.size / quizData.length) * 100}%`;

    // Render Answers Interface
    ansContainer.innerHTML = '';

    q.parts.forEach((part, index) => {
        const partDiv = document.createElement('div');
        partDiv.className = 'part-container glass-card';
        partDiv.style.padding = '1.5rem';
        partDiv.style.marginBottom = '1rem';

        const partLabel = document.createElement('h3');
        partLabel.textContent = part.prompt;
        partLabel.style.marginBottom = '1rem';
        partDiv.appendChild(partLabel);

        if (part.type === 'choice') {
            const grid = document.createElement('div');
            grid.className = 'choices-grid';
            part.options.forEach(opt => {
                const btn = document.createElement('div');
                btn.className = `choice-btn part-${index}`;
                btn.innerHTML = `<span class="choice-letter">${opt.label}</span> <span>${opt.text}</span>`;
                btn.onclick = () => selectChoice(btn, index, opt.label);
                grid.appendChild(btn);
            });
            partDiv.appendChild(grid);
        } else if (part.type === 'multiselect') {
            const grid = document.createElement('div');
            grid.className = 'choices-grid';
            part.options.forEach(opt => {
                const btn = document.createElement('div');
                btn.className = `choice-btn multiselect part-${index}`;
                btn.innerHTML = `<span class="choice-letter" style="background:transparent; border: 2px solid white; border-radius: 4px; color: transparent; width: 24px; height: 24px; display: inline-flex; justify-content: center; align-items: center; font-size: 1rem;">✔</span> <span>${opt.text}</span>`;
                btn.onclick = () => toggleMultiselectChoice(btn, index, opt.label);
                grid.appendChild(btn);
            });
            partDiv.appendChild(grid);
        } else if (part.type === 'fill') {
            const fillDiv = document.createElement('div');
            fillDiv.className = 'input-group';

            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'Type your answer here...';
            input.autocomplete = 'off';
            input.dataset.index = index;

            input.addEventListener('input', (e) => {
                const val = e.target.value.trim();
                currentSelectedAnswers[index] = val.length > 0 ? val : null;
                checkSubmittable();
            });

            fillDiv.appendChild(input);
            partDiv.appendChild(fillDiv);
        }
        ansContainer.appendChild(partDiv);
    });
}

function selectChoice(element, partIndex, value) {
    document.querySelectorAll(`.choice-btn.part-${partIndex}`).forEach(btn => btn.classList.remove('selected'));
    element.classList.add('selected');
    currentSelectedAnswers[partIndex] = value;
    checkSubmittable();
}

function toggleMultiselectChoice(element, partIndex, value) {
    if (element.classList.contains('selected')) {
        element.classList.remove('selected');
        const letterSpan = element.querySelector('.choice-letter');
        if (letterSpan) {
            letterSpan.style.background = 'transparent';
            letterSpan.style.color = 'transparent';
        }
        currentSelectedAnswers[partIndex] = currentSelectedAnswers[partIndex].filter(v => v !== value);
    } else {
        element.classList.add('selected');
        const letterSpan = element.querySelector('.choice-letter');
        if (letterSpan) {
            letterSpan.style.background = '#10b981';
            letterSpan.style.borderColor = '#10b981';
            letterSpan.style.color = 'white';
        }
        currentSelectedAnswers[partIndex].push(value);
    }
    checkSubmittable();
}

function checkSubmittable() {
    const q = quizData[currentQuestionIndex];
    const allAnswered = currentSelectedAnswers.every((ans, i) => {
        if (q.parts[i].type === 'multiselect') return ans && ans.length > 0;
        return ans !== null;
    });
    submitBtn.disabled = !allAnswered;
}

submitBtn.onclick = () => {
    const q = quizData[currentQuestionIndex];
    const allAnswered = currentSelectedAnswers.every((ans, i) => {
        if (q.parts[i].type === 'multiselect') return ans && ans.length > 0;
        return ans !== null;
    });
    if (!allAnswered) return;
    
    // Disable interaction after submission
    submitBtn.disabled = true;
    document.querySelectorAll('.choice-btn, input').forEach(el => el.style.pointerEvents = 'none');

    let partsCorrect = 0;

    // Check answers
    q.parts.forEach((part, idx) => {
        let actualAnswer = '';
        if (part.rawAnswer !== undefined) {
            actualAnswer = String(part.rawAnswer);
        } else if (part.obfuscatedAnswer) {
            actualAnswer = String(decryptString(part.obfuscatedAnswer));
        }

        const isMultiselect = part.type === 'multiselect';
        let userAnswer;
        if (isMultiselect) {
            userAnswer = currentSelectedAnswers[idx] || [];
        } else {
            userAnswer = String(currentSelectedAnswers[idx] || '');
        }

        let isCorrect = false;
        if (part.type === 'fill') {
            isCorrect = String(userAnswer).toLowerCase().replace(/\s/g, '') === String(actualAnswer).toLowerCase().replace(/\s/g, '');
        } else if (isMultiselect) {
            const actualArr = Array.isArray(part.rawAnswer) ? part.rawAnswer : [];
            isCorrect = (actualArr.length === userAnswer.length) && actualArr.every(val => userAnswer.includes(val));
        } else {
            isCorrect = userAnswer === actualAnswer;
        }

        if (isCorrect) {
            partsCorrect++;
        }

        // Apply visual feedback to the row/inputs
        const partElements = document.querySelectorAll(`.part-container`)[idx];
        if (partElements) {
            if (part.type === 'choice' || part.type === 'multiselect') {
                const choiceBtns = partElements.querySelectorAll('.choice-btn');
                choiceBtns.forEach(btn => {
                    const btnValue = btn.querySelector('.choice-letter')?.textContent || btn.textContent;
                    const isSelected = isMultiselect ? userAnswer.includes(btnValue) : userAnswer === btnValue;
                    const isActuallyCorrect = isMultiselect ? 
                        (Array.isArray(part.rawAnswer) ? part.rawAnswer.includes(btnValue) : btnValue === String(part.rawAnswer)) :
                        btnValue === actualAnswer;

                    if (isSelected) {
                        btn.classList.add(isActuallyCorrect ? 'is-correct' : 'is-incorrect');
                    } else if (isActuallyCorrect) {
                        // Highlight the correct one if they missed it
                        btn.classList.add('should-have-selected');
                    }
                });
            } else if (part.type === 'fill') {
                const input = partElements.querySelector('input');
                if (input) {
                    input.classList.add(isCorrect ? 'is-correct' : 'is-incorrect');
                    if (!isCorrect) {
                        const correctHint = document.createElement('div');
                        correctHint.className = 'correct-hint';
                        correctHint.textContent = `Correct: ${actualAnswer}`;
                        input.parentNode.appendChild(correctHint);
                    }
                }
            }
        }
    });

    const isFullyCorrect = partsCorrect === q.parts.length;
    
    // Scoring
    const maxPoints = q.derivedPoints || (q.level * 100);
    const earnedPoints = isFullyCorrect ? maxPoints : Math.floor(maxPoints * (partsCorrect / q.parts.length));
    
    totalScore += earnedPoints;
    globalScoreElem.textContent = totalScore;
    answeredQuestions.add(currentQuestionIndex);

    userAnswers.push({
        id: q.id,
        level: q.level,
        benchmarkId: q.benchmarkId,
        partsCorrect: partsCorrect,
        totalParts: q.parts.length,
        pointsEarned: earnedPoints
    });

    saveState();

    // Show Feedback
    if (isFullyCorrect) {
        fTitle.textContent = 'Perfect! 🎉';
        fTitle.className = 'crct';
        fMessage.textContent = `You earned ${earnedPoints} points!`;
    } else if (partsCorrect > 0) {
        fTitle.textContent = 'Partial Credit! 🤔';
        fTitle.className = 'crct';
        fTitle.style.color = '#fbbf24'; 
        fMessage.textContent = `You got ${partsCorrect} out of ${q.parts.length} parts. Earned ${earnedPoints} points.`;
    } else {
        fTitle.textContent = 'Incorrect 😔';
        fTitle.className = 'wrng';
        fMessage.textContent = 'Review this topic carefully. 0 points earned.';
    }

    // Explanation Handling
    const expContainer = document.getElementById('explanation-container');
    const expImg = document.getElementById('explanation-image');
    const expText = document.getElementById('explanation-text');

    let hasExp = false;
    if (q.explanationImage) {
        expImg.src = q.explanationImage;
        expImg.style.display = 'inline-block';
        hasExp = true;
    } else {
        expImg.style.display = 'none';
        expImg.src = '';
    }

    if (q.explanationText) {
        expText.textContent = q.explanationText;
        expText.style.display = 'block';
        hasExp = true;
    } else {
        expText.style.display = 'none';
        expText.textContent = '';
    }

    if (hasExp) {
        expContainer.classList.remove('hidden');
    } else {
        expContainer.classList.add('hidden');
    }

    feedbackOverlay.classList.remove('hidden');
};

nextBtn.onclick = () => {
    feedbackOverlay.classList.add('hidden');
    quizDiv.classList.remove('active');
    
    // Re-render board and show
    initBoard();
    boardDiv.classList.add('active');
    
    // Optional: Check if all answered to auto-end
    if (answeredQuestions.size === quizData.length) {
        setTimeout(showResults, 500);
    }
};

finishQuizBtn.onclick = () => {
    showResults();
};

function showResults() {
    globalHeaderElem.classList.add('hidden');
    boardDiv.classList.remove('active');
    quizDiv.classList.remove('active');
    resultsDiv.classList.add('active');

    // Date and Time
    const now = new Date();
    document.getElementById('current-date-time').textContent = `Completed on: ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`;

    const totalQuestions = quizData.length;
    const questionsCorrect = userAnswers.filter(ans => ans.partsCorrect === ans.totalParts).length;

    const finalPct = totalQuestions > 0 ? Math.round((questionsCorrect / totalQuestions) * 100) : 0;
    document.getElementById('final-score').textContent = totalScore + ' pts';

    // Break down by level
    const levelStats = {};
    const levelsPresent = [...new Set(quizData.map(q => q.level))].sort((a, b) => a - b);

    levelsPresent.forEach(lvl => {
        levelStats[lvl] = { totalQuestions: 0, correctQuestions: 0 };
    });

    userAnswers.forEach(ans => {
        levelStats[ans.level].totalQuestions++;
        if (ans.partsCorrect === ans.totalParts) {
            levelStats[ans.level].correctQuestions++;
        }
    });

    const breakdownContainer = document.getElementById('level-breakdown');
    breakdownContainer.innerHTML = '';

    levelsPresent.forEach(lvl => {
        const stats = levelStats[lvl];
        // If the user skipped questions, they won't be in userAnswers, let's also count the total overall per level
        const actualTotalForLevel = quizData.filter(q => q.level === lvl).length;
        const pct = actualTotalForLevel > 0 ? (stats.correctQuestions / actualTotalForLevel) * 100 : 0;

        const div = document.createElement('div');
        div.className = 'level-stat';
        div.innerHTML = `
            <div class="level-header">
                <span>Level ${lvl}</span>
                <span>${stats.correctQuestions} / ${actualTotalForLevel} (${Math.round(pct)}%)</span>
            </div>
            <div class="level-bar-bg">
                <div class="level-bar-fill" style="width: 0%"></div>
            </div>
        `;
        breakdownContainer.appendChild(div);

        setTimeout(() => {
            div.querySelector('.level-bar-fill').style.width = pct + '%';
        }, 300);
    });
}

document.getElementById('restart-btn').onclick = () => {
    currentQuestionIndex = -1;
    userAnswers = [];
    answeredQuestions.clear();
    totalScore = 0;
    
    localStorage.removeItem('mathQuizState');
    
    resultsDiv.classList.remove('active');
    globalHeaderElem.classList.add('hidden');
    boardDiv.classList.remove('active');
    quizDiv.classList.remove('active');
    startDiv.classList.add('active');
};

const headerRestartBtn = document.getElementById('header-restart-btn');
if (headerRestartBtn) {
    headerRestartBtn.onclick = () => {
        if(confirm("Are you sure you want to start over? All your progress will be lost.")) {
            document.getElementById('restart-btn').onclick();
        }
    };
}

// Image Modal Logic
const imageModal = document.getElementById('image-modal');
const modalImg = document.getElementById('modal-img');

window.openImageModal = function(src) {
    if (!src || !imageModal) return;
    modalImg.src = src;
    imageModal.classList.remove('hidden');
    imageModal.style.opacity = '1';
    imageModal.style.pointerEvents = 'auto';
};

window.closeImageModal = function() {
    if (!imageModal) return;
    imageModal.classList.add('hidden');
    imageModal.style.opacity = '0';
    imageModal.style.pointerEvents = 'none';
};

const closeModalBtn = document.getElementById('close-modal-btn');
if (closeModalBtn) closeModalBtn.onclick = window.closeImageModal;

if (imageModal) {
    imageModal.onclick = (e) => {
        if (e.target === imageModal) window.closeImageModal();
    };
}

const qImageRef = document.getElementById('question-image');
if (qImageRef) {
    qImageRef.style.cursor = 'zoom-in';
    qImageRef.onclick = function() { window.openImageModal(this.src); };
}

const expImgRef = document.getElementById('explanation-image');
if (expImgRef) {
    expImgRef.style.cursor = 'zoom-in';
    expImgRef.onclick = function() { window.openImageModal(this.src); };
}
