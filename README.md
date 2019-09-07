### ModalMadness

A lean vanilla JS modal/slide library w/ support for left/right swipe/touch.
Find usable files in /dist/ or build (see below)

#### Need it now? 

Just grab it in the dist/ directory. See Usage below for how to...use it.

#### Testing/Using in dev

    npm run start

#### Build instructions

    npm run build

results found in /dist/modalmadness.js and /dist/css/modalmadness.css

#### Usage

Manual file usage:

1. See html/template.html for how to use the markup (specific elements w/ IDs and classes).

2. Include modalmadness.js then initialize it: e.g. 

        <link rel="stylesheet" href="/path/to/where/you/put/it/modalmadness.css">

        <script src="/path/to/where/you/put/it/modalmadness.js"></script>
        <script>
            if (modalMadness) {
                modalMadness.init()
            }
        </script>

#### Demo

There's a [simple one](https://gluis.github.io/) that should help you out.
