### ModalMadness

A lean vanilla JS modal/slide library w/ support for left/right swipe/touch.
Find usable files in /dist/ or build (see below)

#### Testing/Using in dev

    npm run start

#### Build instructions

    npm run build

results found in /dist/modalmadness.js and /dist/css/modalmadness.css

#### Usage

Include modalmadness.js (i.e. rename main.js to modalmadness.js) then initialize it: e.g. 

    <link rel="stylesheet" href="/path/to/where/you/put/it/modalmadness.css">

    <script src="/path/to/where/you/put/it/modalmadness.js"></script>
    <script>
        if (modalMadness) {
            modalMadness.init()
        }
    </script>



