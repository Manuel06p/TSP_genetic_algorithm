function tspSolver(distanceMatrix, genThreshold, populationSize, temperature) {
    class Individual {
        constructor() {
            this.gnome = [];
            this.fitness = 0;
        }
    }


    function randNum(start, end) {
        return Math.floor(Math.random() * (end - start)) + start;
    }

    //Controlla se un carattere appare nella stringa
    function isInList(list, value) {
        // Per ogni elemento della lista
        for (let i = 0; i < list.length; i++) {
            if (list[i] === value) { // Se l'elemento corrente è uguale al valore, restituisce true
                return true;
            }
        }
        // Se il valore non occorre mai nella lista, restituisce false
        return false;
    }

    function mutatedGene(gnome) {
        let mutated = false; // Variabile sentinella per controllare l'uscita dal ciclo
        while (!mutated) {
            let r = randNum(1, citiesNum); // Genera un indice casuale per il primo gene
            let r1 = randNum(1, citiesNum); // Genera un indice casuale per il secondo gene
            if (r1 !== r) { // Assicura che i due indici siano diversi
                // Scambia i due geni
                let temp = gnome[r];
                gnome[r] = gnome[r1];
                gnome[r1] = temp;
                mutated = true; // Imposta la variabile sentinella a true per uscire dal ciclo
            }
        }
        return gnome; // Restituisce la lista di interi mutata
    }

    function createGnome() {
        let gnome = [0]; // Inizializza il percorso con la città di partenza come un array di interi

        // Aggiunge le città al percorso finché tutte le città non sono state visitate
        while (gnome.length < citiesNum) {
            let temp = randNum(1, citiesNum); // Genera un numero casuale che rappresenta una città

            // Se la città non è già stata visitata, la aggiunge al percorso e la marca come visitata
            if (!isInList(gnome, temp)) {
                gnome.push(temp); // Aggiunge la città al percorso
            }
        }

        gnome.push(0); // Aggiungi la città di partenza alla fine del percorso
        return gnome; // Restituisci il percorso completo come lista di interi
    }


    function getFitnessValue(gnome) {
        let fitnessValue = 0; // Inizializza il valore di distanza totale a 0
        for (let i = 0; i < gnome.length - 1; i++) { // Esegue un ciclo per la lunghezza di gnome
            let city1 = gnome[i]; // Assegna a city1 l'indice della prima città nel percorso
            let city2 = gnome[i + 1]; // Assegna a city2 l'indice della città successiva nel percorso
            if (distanceMatrix[city1][city2] === Infinity) { // Se la distanza tra city1 e city2 è infinita, quindi non sono collegati, restituisce infinito
                return Infinity;
            }
            fitnessValue += distanceMatrix[city1][city2]; // Aggiunge al valore di distanza totale la distanza tra city1 e city2
        }
        return fitnessValue; // Restituisce il valore di distanza totale
    }


    function cooldown(temperature) {
        return (90 * temperature) / 100; //Riduce la temperatura del 10%
    }

    function tspSolverMain(temperature, genThreshold) {
        let gen = 1;
        let population = [];
        let tempIndividual;

        // Popolamento della popolazione di prima generazione.
        for (let i = 0; i < populationSize; i++) {
            tempIndividual = new Individual();
            tempIndividual.gnome = createGnome();
            tempIndividual.fitness = getFitnessValue(tempIndividual.gnome);
            population.push(tempIndividual);
        }

        // Iterazione per eseguire
        // l'accoppiamento della popolazione e la mutazione del gene.
        while (temperature > 1000 && gen < genThreshold) {
            population.sort((a, b) => a.fitness - b.fitness); //Ordina la popolazione in base ai valori di fitness, in ordine crescente.
            let newPopulation = [];

            for (let i = 0; i < populationSize; i++) {
                let oldIndividual = population[i];

                let isAcceptable = false;
                while (!isAcceptable) {
                    let newGnome = mutatedGene(oldIndividual.gnome);
                    let newIndividual = new Individual();
                    newIndividual.gnome = newGnome;
                    newIndividual.fitness = getFitnessValue(newGnome);

                    if (newIndividual.fitness <= oldIndividual.fitness) {
                        newPopulation.push(newIndividual);
                        isAcceptable = true;
                    } else {
                        let prob = 2.7 ** (-1 * ((newIndividual.fitness - oldIndividual.fitness) / temperature));
                        if (prob > 0.5) {
                            newPopulation.push(newIndividual);
                            isAcceptable = true;
                        }
                    }
                }
            }

            temperature = cooldown(temperature);
            population = newPopulation;
            gen++;
        }

        let solution = population.reduce((minFitnessIndividual, currentIndividual) => {
            // Se minFitnessIndividual è null o il fitness del currentIndividual è inferiore a quello di minFitnessIndividual
            // assegna currentIndividual a minFitnessIndividual
            if (!minFitnessIndividual || currentIndividual.fitness < minFitnessIndividual.fitness) {
                return currentIndividual;
            } else {
                return minFitnessIndividual;
            }
        }, null);

        solution.gen = gen;
        solution.temperature = temperature;
        return solution;
    }

    let citiesNum = distanceMatrix.length;

    let solution =  tspSolverMain(temperature, genThreshold);
    console.log("Percorso: " + solution.gnome + "\n" +
                "Distanza: " + solution.fitness + "\n" +
                "Popolazione massima: "  + populationSize + "\n" +
                "Numero di città: "  + citiesNum + "\n" +
                "Temperatura iniziale: " + temperature + "\n" +
                "Temperatura finale: " + solution.temperature + "\n" +
                "Generazione limite: "  + genThreshold + "\n" +
                "Generazione finale: "  + solution.gen + "\n"

    );
    return solution;
}

function generateDistanceMatrix(x, y, n) {

    let points = []; //Punti casuali all'interno del piano
    for (let i = 0; i < n; i++) {
        let point = {
            x: Math.random() * x,
            y: Math.random() * y
        };
        points.push(point);
    }

    // Step 2: Calcola la distanza euclidea tra ogni coppia di punti
    let distanceMatrix = [];
    for (let i = 0; i < n; i++) {
        distanceMatrix[i] = [];
        for (let j = 0; j < n; j++) {
            //Calcolo della distanza tra i due punti
            let dx = points[i].x - points[j].x;
            let dy = points[i].y - points[j].y;
            let distance = Math.sqrt(dx ** 2 + dy ** 2);
            distanceMatrix[i][j] = distance;
        }
    }

    // Step 3: Restituisci la matrice delle distanze

    return distanceMatrix;
}
console.log("TSP 1");
const distanceMatrix1 = generateDistanceMatrix(100, 50, 100);
let solution1_1 = tspSolver(distanceMatrix1, 10, 1000, 10000);
let solution1_2 = tspSolver(distanceMatrix1, 10, 100, 10000);
let solution1_3 = tspSolver(distanceMatrix1, 10, 10, 10000);

console.log("TSP 2");
const distanceMatrix2 = generateDistanceMatrix(100, 50, 100);
let solution2_1 = tspSolver(distanceMatrix2, 10, 1000, 10000);
let solution2_2 = tspSolver(distanceMatrix2, 10, 100, 10000);
let solution2_3 = tspSolver(distanceMatrix2, 10, 10, 10000);
