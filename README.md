<div class="titlingpage">

![map](https://github.com/user-attachments/assets/c17d9eff-8d00-4fa5-bb49-3a69f349a372)

</div>

# Introduzione

Il problema del “Commesso Viaggiatore", noto anche come “Travelling
Salesman Problem" (TSP) in inglese, rappresenta una delle sfide più
emblematiche nel campo dell’ottimizzazione combinatoria. La sua
formulazione prevede che un commesso viaggiatore visiti un insieme di
città esattamente una volta ciascuna e torni poi alla città di partenza,
minimizzando la distanza totale percorsa. In termini più tecnici, si
tratta di trovare il percorso più breve possibile che attraversi tutte
le città date.

Questa problematica, sebbene nata in ambito logistico e di
pianificazione dei trasporti, ha suscitato un grande interesse anche
nell’ambito della ricerca computazionale. La sua complessità intrinseca
lo colloca tra i problemi NP-hard, il che significa che non esiste un
algoritmo polinomiale che possa risolverlo in tempo ragionevole per un
numero arbitrario di città.

![tsp_problem_art_0](https://github.com/user-attachments/assets/2507d7b0-fd29-4727-9545-dd6a2462cb8c)


Nel corso di questo progetto, esploreremo l’applicazione degli algoritmi
genetici per trovare una soluzione accettabile per il problema del
Commesso Viaggiatore. Gli algoritmi genetici costituiscono una classe di
algoritmi ispirati al processo evolutivo naturale, che si sono
dimostrati particolarmente efficaci nel risolvere problemi di
ottimizzazione combinatoria come il TSP. Inoltre, utilizzeremo una
tecnica ispirata al raffreddamento simulato, Simulated Annealing in
inglese, per controllare la temperatura durante la ricerca dello spazio
delle soluzioni.

# Algoritmi genetici

Gli algoritmi genetici costituiscono una classe di algoritmi euristici
di ricerca ispirati ai meccanismi di evoluzione naturale, come la
selezione naturale, la mutazione e la ricombinazione genetica. Ideati da
John Holland negli anni ’60, sono stati utilizzati con successo per
risolvere una vasta gamma di problemi di ottimizzazione, inclusi quelli
combinatori, i problemi di ricerca e i problemi di apprendimento
automatico.

L’idea alla base degli algoritmi genetici è simulare il processo di
evoluzione biologica, come descritto da Charles Darwin, all’interno di
un ambiente di ricerca artificiale. In un algoritmo genetico, una
soluzione al problema in esame è rappresentata come un individuo in una
popolazione. Ogni individuo è caratterizzato da un insieme di parametri
o “geni", che possono essere combinati e modificati attraverso operatori
genetici come la mutazione e la ricombinazione.

<img width="1024" height="1024" alt="darwin_theory" src="https://github.com/user-attachments/assets/218d5797-54f3-42d1-8e55-720c8a599d5f" />

Il processo di ricerca avviene attraverso una serie di iterazioni
chiamate “generazioni". Ad ogni generazione, gli individui della
popolazione vengono valutati in base alla loro idoneità rispetto al
problema in esame. Gli individui migliori vengono selezionati per
sopravvivere e riprodursi, mentre quelli meno adatti vengono eliminati o
sopravvivono solo in presenza di alcune condizioni. Nell’implementazione
che vedremo, la condizione per salvare alcuni individui non idonei, sarà
determinata anche dalla temperatura, secondo un principio ispirato a
quello del simulated anealing.

Uno dei vantaggi principali degli algoritmi genetici è la loro capacità
di esplorare rapidamente uno spazio delle soluzioni molto ampio e
potenzialmente complesso. Attraverso la combinazione di selezione,
mutazione e ricombinazione, essi possono convergere verso soluzioni di
ottimo locale o globale per una vasta gamma di problemi di
ottimizzazione.

Nella risoluzione del problema del Commesso Viaggiatore, gli algoritmi
genetici offrono un approccio flessibile ed efficace per la ricerca di
soluzioni accettabili. Utilizzando una rappresentazione adatta delle
soluzioni e operatori genetici appropriati, è possibile ottenere
risultati competitivi in termini di efficienza e qualità della
soluzione. In casi pratici, infatti, gli algoritmi euristici risolvono
di fatto il problema, sebbene non si abbia la certezza che le soluzioni
trovate siano ottime.

# Programma

Il programma che andremo ad analizzare e scomporre, per facilitarne la
spiegazione, implementerà gli algoritmi genetici per la risoluzione del
problema del Commesso Viaggiatore. Verrà analizzata la variante classica
del problema, nella quale il commesso potrà passare da ogni città una
sola volta. Le città verranno generate casualmente su piano
bidimensionale e la distanza fra esse verrà calcolata come la migliore
ipotetica, utilizzando il teorema di Pitagora. Il codice è interamente
scritto in JavaScript e le città con le rispettive distanze verranno
memorizzate all’interno di una matrice

## Generazione della matrice

La funzione riportata di seguito si occupa di generare **n** città in
posizione casuale su un piano di dimensioni **x** \* **y**. Crea poi una
matrice delle distanze tra tutte le città, utilizzando il teorema di
Pitagora, restituendola come valore di return.

<div class="tcolorbox">

``` javascript
//Funzione che crea la matrice delle distanze, sulla base delle dimensioni del piano e il numero di città
function generateDistanceMatrix(x, y, n) {
    let points = []; //Punti casuali all'interno del piano
    for (let i = 0; i < n; i++) {
        let point = {
            x: Math.random() * x,
            y: Math.random() * y
        };
        points.push(point);
    }
    //Calcola la distanza tra ogni coppia di punti
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
    //Restituisci la matrice delle distanze
    return distanceMatrix;
}
```

</div>

## Classe individuo

La classe riportata di seguito si occupa di definire gli attributi di
ogni individuo generato.

<div class="tcolorbox">

``` javascript
//Classe che rappressenta un individuo
class Individual {
    constructor() {
        this.gnome = []; //Percorso delle città
        this.fitness = 0; //Distanza totale
    }
}
```

</div>

## Generazione di un valore casuale

La funzione riportata di seguito si occupa di generare un numero casuale
in un intervallo specificato.

<div class="tcolorbox">

``` javascript
//Funzione che genera un numero casuale nell'intervallo passato come parametro
function randNum(start, end) {
    return Math.floor(Math.random() * (end - start)) + start;
}
```

</div>

## Controllo della presenza di un valore in una lista

La funzione riportata di seguito si occupa di controllare se un valore
appare all’interno di una lista.

<div class="tcolorbox">

``` javascript
//Controlla se un valore appare in una lista
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
```

</div>

## Generazione di un percorso casuale

La funzione riportata di seguito si occupa di creare un percorso che che
parta dalla città iniziale e finisca nella medisima, passando per tutte
le altre, una sola volta e in maniera casuale. Negli algoritmi genetici,
questa operazione si occupa di creare il genoma di un individuo.

<div class="tcolorbox">

``` javascript
//Funzione che crea il percorso da assegnare all'individuo
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
```

</div>

## Mutamento di un percorso

La funzione riportata di seguito si occupa di mutare un percorso,
scegliendo due città casuali, diverse, e scambiandole di posizione.
Questa operazione, negli algoritmi genetici, rappresenta il mutamento di
un genoma.

<div class="tcolorbox">

``` javascript
//Funzione che muta il percorso di un gene
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
```

</div>

## Calcolo della distanza totale di un percorso

La funzione riportata di seguito si occupa di calcolare la distanza
totale tra le città in un percorso passato come parametro. Negli
algoritmi genetici, questa operazione calcola il valore di fitness
(idoneità), di un determinato genoma. In questo caso un valore di
fitness minore, rappresenta una soluzione migliore.

<div class="tcolorbox">

``` javascript
//Funzione che calcola la distanza totale in base al percorso
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
```

</div>

## Riduzione della temperatura

La funzione riportata di seguito si occupa ridurre la temperatura del
10%. In questa implementazione degli algoritmi genetici, la temperatura
viene utilizzata per generare un effetto di Simulated Anealing,
permettendoci di espandere lo spazio delle soluzioni. Con una
temperatura più alta, infatti, potranno essere selezionate anche
soluzioni non ottimali, che potranno però migliorare nelle generazioni
successive.

<div class="tcolorbox">

``` javascript
//Funzione che riduce la temperatura
function cooldown(temperature) {
    return (90 * temperature) / 100; //Riduce la temperatura del 10%
}
```

</div>

## Algoritmo risolutivo

La funzione riportata di seguito si occupa di trovare delle potenziali
soluzioni accettabili utilizzando gli algoritmi genetici. Crea una
popolazione di individui con genomi casuali, i quali vengono poi fatti
evolvere nel corso delle varie generazioni. L’evoluzione di un
individuo, presenta dei requisiti sul valore di fitness, ed è
influenzata, come accennato precedentemente, dalla temperatura. Il
valore di temperatura viene, infatti, ridotto ad ogni generazione,
riducendo così nel tempo lo spazio delle soluzioni.  
Una volta concluso il processo di evoluzione, viene selezionato, tra gli
individui dell’ultima generazione, quello con il valore di fitness
inferiore, che rappresenta la soluzione fornita dall’algoritmo.

<div class="tcolorbox">

``` javascript
//Funzione che gestisce la risoluzione del problema del commesso viaggiatore
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

    // Creazione della popolazione della nuova epoca e la mutazione del gene.
    while (temperature > 1000 && gen < genThreshold) {
        population.sort((a, b) => a.fitness - b.fitness); //Ordina la popolazione in base ai valori di fitness, in ordine crescente.
        
        let newPopulation = [];
        for (let i = 0; i < populationSize; i++) {
            let oldIndividual = population[i];

            let isAcceptable = false;
```

</div>

<div class="tcolorbox">

``` javascript
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
```

</div>

## Generazione della soluzione

La funzione riportata di seguito, che rappresenta una chiusura contente
tutto il codice analizzato in precedenza ad esclusione della funzione di
generazione della matrice, si occupa di richiamare l’algoritmo della
soluzione con i parametri passati. Le specifiche personalizzabili
riguardano la matrice delle distanze, il numero di generazioni, il
numero di individui per popolazione e il valore di temeperatura
iniziale. La funzione si occupa inoltre di stampare in console alcune
informazioni riguardanti la soluzione ottenuta, oltre a restituirla come
return.

<div class="tcolorbox">

``` javascript
//Funzione che risolve il problema del commesso viaggiatore, in base ai parametri passati
function tspSolver(distanceMatrix, genThreshold, populationSize, temperature) {
```

</div>

<div class="tcolorbox">

``` javascript
    //...
    //Codice analizzato in precedenza
    //...

    //Numero totale di città
    let citiesNum = distanceMatrix.length;

    //Soluzione prodotta
    let solution =  tspSolverMain(temperature, genThreshold);

    //Output in console con informazioni riguardanti la soluzione trovata
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
```

</div>

## Test

Proviamo ora ad eseguire dei test utilizzando delle matrici generate
casualmente. In entrambi i test andremo ad applicare l’algortimo di
ricerca della soluzione con 10, 100 e 1000 individui. Ci aspettiamo che
le soluzioni ottenute con più individui siano mediamente migliori,
sebbene questa non sia una certezza:

<div class="tcolorbox">

``` javascript
console.log("TSP 1");
const distanceMatrix1 = generateDistanceMatrix(100, 50, 100);
let solution1_1 = tspSolver(distanceMatrix1, 10, 1000, 10000);
let solution1_2 = tspSolver(distanceMatrix1, 10, 100, 10000);
let solution1_3 = tspSolver(distanceMatrix1, 10, 10, 10000);
```

</div>

<div class="tcolorbox">

``` javascript
TSP 1
Percorso:
0,97,59,3,45,74,91,75,39,11,30,17,33,22,34,67,28,23,78,64,96,68,24,56,72,32,
21,44,65,2,55,13,49,60,41,36,52,47,87,5,86,43,84,77,18,48,66,71,70,90,27,62,
9,81,92,42,46,10,20,82,14,51,25,7,26,63,19,15,83,80,58,16,79,99,50,76,12,57,
1,37,53,4,6,88,31,93,35,73,85,40,69,95,61,54,8,38,89,98,29,94,0
Distanza: 3369.6645973001223
Popolazione massima: 1000
Numero di città: 100
Temperatura iniziale: 10000
Temperatura finale: 3874.20489
Generazione limite: 10
Generazione finale: 10

Percorso:
0,2,32,22,79,58,5,7,80,84,54,8,10,89,75,69,1,90,12,4,74,60,36,37,91,68,55,82,
18,14,78,28,27,73,93,81,94,46,98,39,19,6,3,11,97,61,71,9,57,88,35,76,53,30,
70,24,26,38,51,77,41,16,33,59,42,83,92,15,49,45,44,99,64,21,48,96,66,40,31,
72,13,52,63,17,67,65,47,95,43,50,86,25,62,87,20,29,56,85,34,23,0
Distanza: 3600.7005739995834
Popolazione massima: 100
Numero di città: 100
Temperatura iniziale: 10000
Temperatura finale: 3874.20489
Generazione limite: 10
Generazione finale: 10

Percorso: 
0,92,52,63,69,68,48,77,46,74,43,17,97,79,91,84,42,64,49,47,54,89,70,35,12,5,
88,9,61,19,59,71,50,66,21,67,83,85,2,22,29,4,38,1,30,94,26,60,10,39,25,11,45,
31,51,72,15,55,14,98,44,90,78,80,7,41,27,81,37,28,58,57,6,13,40,24,20,53,75,
87,34,23,99,18,32,86,8,36,3,56,76,73,96,95,16,33,65,82,62,93,0
Distanza: 3690.059250032513
Popolazione massima: 10
Numero di città: 100
Temperatura iniziale: 10000
Temperatura finale: 3874.20489
Generazione limite: 10
Generazione finale: 10
```

</div>

<div class="tcolorbox">

``` javascript
console.log("TSP 2");
const distanceMatrix2 = generateDistanceMatrix(100, 50, 100);
let solution2_1 = tspSolver(distanceMatrix2, 10, 1000, 10000);
let solution2_2 = tspSolver(distanceMatrix2, 10, 100, 10000);
let solution2_3 = tspSolver(distanceMatrix2, 10, 10, 10000);
```

</div>

<div class="tcolorbox">

``` javascript
TSP 2
Percorso: 
0,97,59,33,90,6,31,3,44,39,67,71,51,79,1,36,70,24,9,74,37,80,23,46,92,62,18,
38,41,20,7,69,5,57,91,26,75,88,96,29,48,4,95,61,64,83,72,58,63,28,27,21,47,
19,93,14,42,34,89,45,98,10,78,22,68,15,8,2,82,65,73,13,81,12,99,53,40,50,76,
56,49,84,52,54,55,87,25,77,11,16,43,35,94,66,30,86,17,85,60,32,0
Distanza: 3732.3826493159777
Popolazione massima: 1000
Numero di città: 100
Temperatura iniziale: 10000
Temperatura finale: 3874.20489
Generazione limite: 10
Generazione finale: 10

Percorso: 
0,49,90,89,71,85,29,40,2,4,39,77,72,79,99,31,36,87,93,13,84,33,5,96,67,66,27,
58,41,45,78,61,94,46,32,80,63,37,69,73,26,3,19,42,83,34,25,81,6,14,7,75,59,
82,54,9,86,57,8,38,74,21,15,68,30,64,22,17,50,65,55,51,48,97,44,52,43,53,70,
92,28,24,11,20,23,98,12,62,10,47,60,56,95,76,16,91,1,18,88,35,0
Distanza: 3838.951427401318
Popolazione massima: 100
Numero di città: 100
Temperatura iniziale: 10000
Temperatura finale: 3874.20489
Generazione limite: 10
Generazione finale: 10

Percorso: 
0,21,56,46,84,54,8,50,38,71,13,66,9,89,60,94,14,85,95,52,5,19,69,26,97,33,81,
35,25,31,76,4,28,18,7,3,1,61,2,96,43,75,20,79,6,34,88,32,91,41,27,90,80,65,
45,73,68,77,24,47,48,78,57,10,67,15,49,53,36,74,62,37,40,39,70,87,92,55,44,
23,63,59,22,98,29,72,16,64,93,11,83,86,51,30,82,58,17,42,12,99,0
Distanza: 4061.145339037143
Popolazione massima: 10
Numero di città: 100
Temperatura iniziale: 10000
Temperatura finale: 3874.20489
Generazione limite: 10
Generazione finale: 10
```

</div>

# Fonti

-   Google (motore di ricerca)

-   Chat GPT

-   DALL-E 3

-   Wikipedia

-   GeeksForGeeks

-   Appunti di informatica 2: Libro
