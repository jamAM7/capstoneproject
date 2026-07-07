# DSA Learning Platform

An interactive web app for learning data structures and algorithms, built as
my final-year capstone research project. The project investigated a
research question — *what is an effective architecture for an
education-focused algorithm visualisation tool?* — and produced a React
platform to explore it, alongside a written analysis of the architectural
findings.

**Live site:** [learningdsacapstone.netlify.app](https://learningdsacapstone.netlify.app)

[![DSA Learning Platform demo](https://img.youtube.com/vi/RD19y2pObLE/maxresdefault.jpg)](https://www.youtube.com/watch?v=RD19y2pObLE)

## Overview

DSA content is widely recognised as one of the harder areas of computer
science education, largely due to the abstract nature of the concepts.
Existing research shows visualisation can help, but only when it's genuinely
interactive — passive animation alone has limited pedagogical value. This
project explored what architecture actually supports that kind of
interactivity across a broad range of content, rather than building a single
polished visualiser for one type of algorithm.

The system splits content into two top-level categories — **list-based**
and **graph-based** — with **data structures** and **algorithms** separated
within each. A shared, modular `TopicViewer` page handles navigation and the
pseudocode panel, while different visualiser components get swapped in per
topic. Selecting an algorithm still shows the relevant underlying data
structure, with the algorithm animating on top of it, and pseudocode
highlights in sync with each step.

## Features

- **Sorting visualisers** in two modes — square (labelled swaps) and bar
  (relative height) — covering Bubble, Selection, and Quick Sort, with
  user-defined input arrays and step-forward/step-back controls
- **Pathfinding visualisers** in two forms: a grid-based view, effective for
  showing algorithm efficiency at scale (e.g. DFS solving a deep graph in far
  fewer steps than BFS, despite not finding the shortest path), and a
  node-based view for following exact step-by-step traversal
- **Synchronised pseudocode panel** highlighting the active line as each
  visualisation steps forward
- **User-defined graphs** — toggle nodes and edges to build custom test
  cases for BFS, DFS, Dijkstra, and A*
- **Manim-rendered animation** for Merge Sort, used where the standard
  swap-based sorting visualiser broke down for a divide-and-conquer algorithm

## Key findings from the research

- **No single visualisation technique is universal.** Effectiveness depends
  on the algorithm's structural characteristics — sorting algorithms with
  similar mechanics could share one visualiser, but Merge Sort's
  divide-and-merge structure needed a fundamentally different approach
  (Manim), since it doesn't reduce to comparing and swapping elements.
- **Modular architecture was the effective response.** Decoupling the
  visualiser from the surrounding interface (navigation, pseudocode panel,
  layout) let different visualisation strategies slot in per topic without
  redesigning the system each time.
- **Pre-rendered video has a real interactivity cost.** The Manim animation
  visualised Merge Sort's subdivision clearly, but as a fixed video it
  couldn't accept user-defined arrays or sync with the live pseudocode panel
  — a direct trade-off against the interactivity the rest of the system is
  built around.
- **Grid vs. node pathfinding views show different things.** The grid format
  is better for observing algorithm efficiency at scale (step counts across
  a large graph); the node format is better for following exact
  point-to-point movement. An early D3.js-based node visualiser was
  abandoned in favour of a hardcoded grid layout, as D3's force simulation
  made node positions inconsistent and hard to reproduce for testing.

## Tech stack

- React + TypeScript + Vite
- Modular `TopicViewer` architecture with per-topic swappable visualisers
- Manim for the Merge Sort animation
- Deployed on Netlify
