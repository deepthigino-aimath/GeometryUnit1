// Simple encoding function
const xorKey = "mathquiz";
function encryptString(str) {
    let result = '';
    for (let i = 0; i < str.length; i++) {
        result += String.fromCharCode(str.charCodeAt(i) ^ xorKey.charCodeAt(i % xorKey.length));
    }
    return btoa(result);
}

// Global Unit Configuration
const unitName = "Math Review Unit 1"; // <--- CHANGE THIS FOR EVERY UNIT

// ============================================
// BENCHMARK 1 QUESTIONS
// ============================================
const b1_quizData = [
    {
        id: 1,
        level: 2,
        imagePath: 'images/b1/q1.png',
        // Instead of a single answerType, we define an array of "parts" for each blank to fill out.
        parts: [
            { type: 'fill', prompt: 'm∠2 =', rawAnswer: '71' },
            { type: 'fill', prompt: 'm∠3 =', rawAnswer: '109' },
            { type: 'fill', prompt: 'm∠4 =', rawAnswer: '71' },
            { type: 'fill', prompt: 'm∠5 =', rawAnswer: '109' },
            { type: 'fill', prompt: 'm∠6 =', rawAnswer: '71' },
            { type: 'fill', prompt: 'm∠7 =', rawAnswer: '109' },
            { type: 'fill', prompt: 'm∠8 =', rawAnswer: '71' }
        ],
        explanationText: `180° − 109° = 71°. Consecutive angles are supplementary.
                    𝑚∠2 = 71°
                    𝑚∠3 = 109°
                    𝑚∠4 = 71°
                    𝑚∠5 = 109°
                    𝑚∠6 = 71°
                    𝑚∠7 = 109°
                    𝑚∠8 = 71°`,
        // explanationImage: 'images/exp1.png' (optional)
    },
    {
        id: 2,
        level: 3,
        imagePath: 'images/b1/q2.png',
        parts: [
            { type: 'fill', prompt: 'x =', rawAnswer: '35' },
            { type: 'fill', prompt: 'y =', rawAnswer: '85' }
        ],
        explanationImage: 'images/q2answer.png',
    },
    {
        id: 3,
        level: 4,
        imagePath: 'images/b1/q3.png',
        parts: [
            { type: 'fill', prompt: 'x =', rawAnswer: '5' },
            { type: 'fill', prompt: 'y =', rawAnswer: '25' }
        ],
        explanationImage: 'images/b1/q3answer.png'
    },
    {
        id: 4,
        level: 4,
        imagePath: 'images/b1/q4.png',
        parts: [
            {
                type: 'choice',
                prompt: 'Is her solution correct?',
                options: [
                    { text: 'A. No, there is no mistake that was made.', label: 'A' },
                    { text: 'B. Yes, there is a mistake in Step ____', label: 'B' }
                ],
                rawAnswer: 'A'
            },
            { type: 'fill', prompt: 'If B, which Step #?', rawAnswer: '1' }
        ],
        explanationImage: 'images/b1/q4answer.png'
    }
];


// ============================================
// BENCHMARK 2 QUESTIONS
// ============================================
const b2_quizData = [
    {
        id: 1,
        level: 2,
        imagePath: 'images/b2/q1.png',
        parts: [
            {
                type: 'choice',
                options: [
                    { text: 'AA Similarity', label: 'A' },
                    { text: 'SSS Similarity', label: 'B' },
                    { text: 'SAS Similarity', label: 'C' },
                    { text: 'AAA Similarity', label: 'D' }
                ],
                rawAnswer: 'A'
            }
        ],
        explanationImage: 'images/b2/a1.png',
    },
    {
        id: 2,
        level: 3,
        imagePath: 'images/b2/q2.png',
        parts: [
            {
                type: 'choice',
                options: [
                    { text: 'Corresponding Angles Postulate, Angle-Angle Similarity Postulate', label: 'A' },
                    { text: 'Corresponding Angles Postulate, Third Angles Theorem', label: 'B' },
                    { text: 'Vertical Angles Theorem, Angle-Angle Similarity Postulate', label: 'C' },
                    { text: 'Vertical Angles Theorem, Third Angles Theorem', label: 'D' }
                ],
                rawAnswer: 'C'
            }
        ],
        explanationImage: 'images/b2/a2.png',
    },
    {
        id: 3,
        level: 4,
        imagePath: 'images/b2/q3.png',
        parts: [
            {
                type: 'choice',
                options: [
                    { text: 'I, II, III, IV, V', label: 'A' },
                    { text: 'III, V, I, II, IV', label: 'B' },
                    { text: 'III, II, V, I, IV', label: 'C' },
                    { text: 'II, V, III, IV, I', label: 'D' }
                ],
                rawAnswer: 'C'
            }
        ],
        explanationImage: 'images/b2/a3.png'
    },
    {
        id: 4,
        level: 4,
        imagePath: 'images/b2/q4.png',
        parts: [
            {
                type: 'choice',
                options: [
                    { text: '∠𝑆𝑇𝑅 ≅ ∠𝑈𝑇𝑅, Definition of Vertical Angles', label: 'A' },
                    { text: '∠𝑆𝑇𝑅 ≅ ∠𝑈𝑇𝑅, Third Angles Theorem', label: 'B' },
                    { text: '△ 𝑆𝑅𝑇 ≅ △ 𝑈𝑅𝑇, SAS', label: 'C' },
                    { text: '△ SRT ≅ △ URT, AAS', label: 'D' }
                ],
                rawAnswer: 'D'
            }
        ],
        explanationImage: 'images/b2/a4.png'
    }
];

// Provide empty arrays for other benchmarks so they can be easily filled out
const b3_quizData = [
    {
        id: 1,
        level: 2,
        imagePath: 'images/b3/q1.png',
        parts: [
            {
                type: 'choice',
                options: [
                    { text: '∠A, ∠B, ∠C', label: 'A' },
                    { text: '∠B, ∠A, ∠C', label: 'B' },
                    { text: '∠C, ∠B, ∠A', label: 'C' },
                    { text: '∠B, ∠C, ∠A', label: 'D' }
                ],
                rawAnswer: 'D'
            }
        ],
        explanationImage: 'images/b3/a1.png',
    },
    {
        id: 2,
        level: 3,
        imagePath: 'images/b3/q2.png',
        parts: [
            { type: 'fill', prompt: 'x =', rawAnswer: '4.75' },
            { type: 'fill', prompt: 'y =', rawAnswer: '6' },
            { type: 'fill', prompt: 'z =', rawAnswer: '1' }
        ],
        explanationImage: 'images/b3/a2.png',
    },
    {
        id: 3,
        level: 4,
        imagePath: 'images/b3/q3.png',
        parts: [
            { type: 'fill', prompt: 'The distance(in yards) you walk is =', rawAnswer: '402' }
        ],
        explanationImage: 'images/b3/a3.png'
    },
    {
        id: 4,
        level: 4,
        imagePath: 'images/b3/q4.png',
        parts: [
            {
                type: 'choice',
                options: [
                    { text: 'Reason 2, Corresponding Angles are Congruent', label: 'A' },
                    { text: 'Reason 4, Symmetric Property of Congruence', label: 'B' },
                    { text: 'Reason 5, Isosceles Triangle Theorem', label: 'C' },
                    { text: 'Statement 4, ∠1 ≅ ∠4', label: 'D' }
                ],
                rawAnswer: 'A'
            }
        ],
        explanationImage: 'images/b3/a4.png'
    }
];


const b4_quizData = [
    {
        id: 1,
        level: 2,
        imagePath: 'images/b4/q1.png',
        parts: [
            {
                type: 'choice',
                options: [
                    { text: '𝑃𝑆 = 5 𝑜𝑟 𝑚∠𝑄 = 105°', label: 'A' },
                    { text: '𝑃𝑆 = 4 𝑜𝑟 𝑚∠𝑄 = 105°', label: 'B' },
                    { text: '𝑃𝑆 = 5 𝑜𝑟 𝑚∠𝑄 = 75°', label: 'C' },
                    { text: '𝑃𝑆 = 4 𝑜𝑟 𝑚∠𝑄 = 75°', label: 'D' }
                ],
                rawAnswer: 'A'
            }
        ],
        explanationImage: 'images/b4/a1.png',
    },
    {
        id: 2,
        level: 3,
        imagePath: 'images/b4/q2.png',
        parts: [
            { type: 'fill', prompt: 'x =', rawAnswer: '6' },
            { type: 'fill', prompt: 'y =', rawAnswer: '-10' }
        ],
        explanationImage: 'images/b4/a2.png',
    },
    {
        id: 3,
        level: 4,
        imagePath: 'images/b4/q3.png',
        parts: [
            {
                type: 'choice',
                options: [
                    { text: 'BD ≅ BD ; Reflexive Property', label: 'A' },
                    { text: 'AB ≅ CD ; BC ≅ DA ; Reflexive Property', label: 'B' },
                    { text: '∠ABD ≅ ∠CBD and ∠ADB ≅ ∠CDB; When parallel lines are cut by a transversal, alternate interior angles are congruent.', label: 'C' },
                    { text: '∠BAC ≅ ∠DCA and ∠BCA ≅ ∠DAC; When parallel lines are cut by a transversal, alternate interior angles are congruent.', label: 'D' }
                ],
                rawAnswer: 'D'
            }
        ],
        explanationImage: 'images/b4/a3.png'
    },
    {
        id: 4,
        level: 4,
        imagePath: 'images/b4/q4.png',
        parts: [
            {
                type: 'choice',
                options: [
                    { text: 'III, V, IV', label: 'A' },
                    { text: 'V, II, IV', label: 'B' },
                    { text: 'IV, V, III', label: 'C' },
                    { text: 'IV, III, V', label: 'D' }
                ],
                rawAnswer: 'C'
            }
        ],
        explanationImage: 'images/b4/a4.png'
    }
];


const b5_quizData = [
    {
        id: 1,
        level: 2,
        imagePath: 'images/b5/q1.png',
        parts: [
            { type: 'fill', prompt: 'x =', rawAnswer: '20.6' }
        ],
        explanationImage: 'images/b5/a1.png',
    },
    {
        id: 2,
        level: 3,
        imagePath: 'images/b5/q2.png',
        parts: [
            { type: 'fill', prompt: 'x =', rawAnswer: '11' }
        ],
        explanationImage: 'images/b5/a2.png',
    },
    {
        id: 3,
        level: 4,
        imagePath: 'images/b5/q3.png',
        parts: [
            { type: 'fill', prompt: 'The length of the mid segment is  =', rawAnswer: '6.18' }
        ],
        explanationImage: 'images/b5/a3.png'
    },
    {
        id: 4,
        level: 4,
        imagePath: 'images/b5/q4.png',
        parts: [
            {
                type: 'multiselect',
                prompt: 'Select all that apply.',
                options: [
                    { text: 'Replace Statement 2 with ∠KJM ≅ ∠LMJ', label: 'A' },
                    { text: 'Replace Statement 2 with ∠LJK ≅ ∠KML', label: 'B' },
                    { text: 'Replace Statement 3 with JL ≅ KM', label: 'C' },
                    { text: 'Replace Statement 3 with JM ≅ MJ', label: 'D' },
                    { text: 'Replace Reason 4 with Side-Angle-Side Congruence Theorem (SAS)', label: 'E' },
                    { text: 'Replace Reason 4 with Side-Side-Side Congruence Theorem (SSS)', label: 'F' }
                ],
                rawAnswer: ['A', 'D', 'E']
            }
        ],
        explanationImage: 'images/b5/a4.png'
    }
];


const b6_quizData = [
    {
        id: 1,
        level: 2,
        imagePath: 'images/b6/q1.png',
        parts: [
            { type: 'fill', prompt: 'x =', rawAnswer: '18' }
        ],
        explanationImage: 'images/b6/q1ans.png',
    },
    {
        id: 2,
        level: 3,
        imagePath: 'images/b6/q2.png',
        parts: [
            { type: 'fill', prompt: 'x =', rawAnswer: '27.8' },
            { type: 'fill', prompt: 'y =', rawAnswer: '35' }
        ],
        explanationImage: 'images/b6/q2ans.png',
    },
    {
        id: 3,
        level: 4,
        imagePath: 'images/b6/q3.png',
        parts: [
            { type: 'fill', prompt: 'The distance(in feet) the visitors will be able to get to the statue =', rawAnswer: '7.2' }
        ],
        explanationImage: 'images/b6/q3ans.png'
    },
    {
        id: 4,
        level: 4,
        imagePath: 'images/b6/q4.png',
        parts: [
            { type: 'fill', prompt: 'EY =', rawAnswer: '15' }
        ],
        explanationImage: 'images/b6/q4ans.png'
    }
];


// ============================================
// BENCHMARKS CONFIGURATION
// ============================================
// This controls the visible columns on the board. Tie your quizData arrays here!
const benchmarks = [
    { id: 'b1', name: 'GR.1.1', videoRefresher: 'https://youtube.com/', quizData: b1_quizData, tooltip: 'Prove relationships and theorems about lines and angles.' },
    { id: 'b2', name: 'GR.1.2', videoRefresher: 'https://youtube.com/', quizData: b2_quizData, tooltip: 'Prove triangle congruence or similarity' },
    { id: 'b3', name: 'GR.1.3', videoRefresher: 'https://youtube.com/', quizData: b3_quizData, tooltip: 'Prove relationships and theorems about triangles' },
    { id: 'b4', name: 'GR.1.4', videoRefresher: 'https://youtube.com/', quizData: b4_quizData, tooltip: 'Prove relationships and theorems about parallelograms.' },
    { id: 'b5', name: 'GR.1.5', videoRefresher: 'https://youtube.com/', quizData: b5_quizData, tooltip: 'Prove relationships and theorems about trapezoids' },
    { id: 'b6', name: 'GR.1.6', videoRefresher: 'https://youtube.com/', quizData: b6_quizData, tooltip: 'Congruence or similarity in two-dimensional figures' }
];


// ============================================
// APP ENGINE COMPILATION (Do not modify)
// ============================================
// The app reads 'quizData' globally. This dynamically merges all benchmark arrays.
const quizData = benchmarks.flatMap(b =>
    b.quizData.map(q => ({ ...q, benchmarkId: b.id }))
);
