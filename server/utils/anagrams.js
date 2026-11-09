import fs from "fs"

// Gets anagrams for every valid solution in
// valid_solutions.csv.

const csvPath = new URL("../data/valid_solutions.csv", import.meta.url)

const words = fs.readFileSync(csvPath, "utf8")
    .split(/\r?\n/)
    .map((w) => w.trim().toLowerCase())
    .filter(Boolean); // skips blank lines in the file

const sortLetters = (word) => [...word].sort().join("")
/*
    for example:
    "acert" => ["crate", "react", "trace", "cater"]
*/

const groups = new Map() // a map/dictionary of where we'll store our anagrams

for(const word of words) {
    const key = sortLetters(word)
    
    // create a new key if that sorted word doesn't exist
    if(!groups.has(key)) {
        groups.set(key, [])
    }

    groups.get(key).push(word)
}

export const getAnagrams = (word) => {
    const lower = word.toLowerCase()
    return (groups.get(sortLetters(lower)) ?? []).filter((w) => w !== lower)
    /* The above line basically searches and returns a list of the word's respective anagrams.
     .filter(w) => w !== lower is basically getting all anagrams except for the word itself, because a word isn't an anagram of itself.
    If it doesn't exist, an empty array is returned.
    */
}