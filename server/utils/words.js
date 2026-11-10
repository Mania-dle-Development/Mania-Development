import { readFileSync } from "fs";

const loadWords = (fileName) => {

    const path = new URL(`../data/${fileName}`, import.meta.url)

    const text = readFileSync(path, "utf8")

    return text
        .split("\n")
        .map((line) => line.trim().toLowerCase())
        .filter((word) => word.length > 0)
}


/*
    To understand the result array and how it corresponds to the Wordle board:
    absent : gray square
    present : yellow square
    correct : green square
*/

export const scoreGuess = (guess, answer) => {
    const result = new Array(guess.length).fill("absent")
    const counts = {} // our counts bag, to cap yellow letters in the game

    // pass 1: finding the green letters
    // if any other letter exists but not in correct position, add to counts object
    for(let i = 0; i < answer.length; i++) {
        if(guess[i] === answer[i]) {
            result[i] = "correct" // an eventual green spot
        }
        else if(counts[answer[i]] !== undefined) {
            counts[answer[i]] += 1
        }
        else {
            counts[answer[i]] = 1
        }
    }

    // pass 2: finding the yellow words within the counts object
    for(let i = 0; i < answer.length; i++) {
        if(result[i] === "correct") {
            // do nothing here
            continue
        }

        // checks if the current letter at index i in our guess
        // exists in the counts map, and has a count of at least 1
        let letter = guess[i]
        if(counts[letter] && counts[letter] > 0) {
            result[i] = "present"
            counts[letter] = counts[letter] - 1
        }
    }
    return result
}

const solutions = loadWords("valid_solutions.csv")
const guesses = loadWords("valid_guesses.csv")

export const VALID_GUESSES = new Set([...guesses, ...solutions])